import pandas as pd
import numpy as np
import json
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, r2_score
from core.state import AgentState

def _detect_target_and_task(df: pd.DataFrame, task_hint: str = "") -> tuple[str, str]:
    """
    Uses heuristics (and optionally LLM) to pick the best target column
    and determine whether this is a classification or regression task.
    """
    target_col = None
    task_type = "classification"

    # Try LLM-based selection first
    try:
        from langchain_ollama import OllamaLLM
        llm = OllamaLLM(model="llama3.2:1b", format="json")
        columns_info = {col: str(df[col].dtype) for col in df.columns}
        prompt = f"""
        Given a dataset with these columns and types: {json.dumps(columns_info)}
        And the user's analysis task: "{task_hint}"
        
        Determine the best TARGET column for ML prediction and whether this is "classification" or "regression".
        A column is "classification" if it has few unique categories (< 20 unique values or is categorical).
        A column is "regression" if it is continuous numeric with many unique values.
        
        Return EXACTLY JSON: {{"target": "column_name", "task_type": "classification_or_regression"}}
        """
        result = json.loads(llm.invoke(prompt))
        candidate = result.get("target", "")
        if candidate in df.columns:
            target_col = candidate
            task_type = result.get("task_type", "classification")
            print(f"[ModelerAgent] LLM selected target='{target_col}', task='{task_type}'")
    except Exception as e:
        print(f"[ModelerAgent] LLM unavailable for target selection, using heuristics: {e}")

    # Fallback heuristics if LLM didn't produce a valid target
    if target_col is None:
        # Prefer the last column as target (common dataset convention)
        numeric_cols = df.select_dtypes(include='number').columns.tolist()
        if not numeric_cols:
            target_col = df.columns[-1]
            task_type = "classification"
        else:
            # Pick the column with fewest unique values among numerics (likely a label)
            # or the last numeric column
            last_col = df.columns[-1]
            if last_col in numeric_cols:
                nunique = df[last_col].nunique()
                task_type = "classification" if nunique <= 20 else "regression"
                target_col = last_col
            else:
                target_col = last_col
                task_type = "classification"
        print(f"[ModelerAgent] Heuristic selected target='{target_col}', task='{task_type}'")

    return target_col, task_type


def modeler_node(state: AgentState):
    """
    Auto-ML Modeler Agent. Benchmarks multiple Scikit-Learn models against the
    cleaned dataset, selects the best one, and reports accuracy/R² scores.
    """
    print("[ModelerAgent] Starting automated model selection and benchmarking...")
    masked_csv = state.get("masked_csv_path")
    task = state.get("task", "")
    logs = state.get("logs", [])

    if not masked_csv:
        return {
            "model_metrics": {"error": "No data available for modeling."},
            "logs": logs + ["ModelerAgent: No dataset found."]
        }

    df = pd.read_csv(masked_csv)

    # --- Step 1: Detect target column and task type ---
    target_col, task_type = _detect_target_and_task(df, task)

    # Ensure we only use numeric columns for features
    feature_cols = [c for c in df.select_dtypes(include='number').columns if c != target_col]

    if len(feature_cols) == 0:
        return {
            "model_metrics": {"error": "No numeric feature columns available after cleaning."},
            "target_column": target_col,
            "logs": logs + ["ModelerAgent: Insufficient numeric features for modeling."]
        }

    X = df[feature_cols].values
    y = df[target_col].values

    # --- Step 2: Scale features ---
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # --- Step 3: Train/Test split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    # --- Step 4: Define candidate models ---
    if task_type == "classification":
        candidates = {
            "Random Forest Classifier": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
            "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=100, random_state=42),
            "Support Vector Machine (SVC)": SVC(kernel='rbf', random_state=42),
            "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
            "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
            "Decision Tree Classifier": DecisionTreeClassifier(random_state=42),
        }
        scoring = "accuracy"
        metric_name = "Accuracy"
    else:
        candidates = {
            "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
            "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, random_state=42),
            "Support Vector Regressor (SVR)": SVR(kernel='rbf'),
            "K-Nearest Neighbors Regressor": KNeighborsRegressor(n_neighbors=5),
            "Linear Regression": LinearRegression(),
            "Decision Tree Regressor": DecisionTreeRegressor(random_state=42),
        }
        scoring = "r2"
        metric_name = "R² Score"

    # --- Step 5: Benchmark all models ---
    all_scores = {}
    best_model_name = None
    best_score = -float('inf')
    best_model = None

    for name, model in candidates.items():
        try:
            # Use cross-validation for robust scoring (3-fold for speed)
            n_folds = min(3, len(X_train)) if len(X_train) >= 3 else 2
            cv_scores = cross_val_score(model, X_train, y_train, cv=n_folds, scoring=scoring)
            mean_score = float(np.mean(cv_scores))
            all_scores[name] = round(mean_score, 4)

            if mean_score > best_score:
                best_score = mean_score
                best_model_name = name
                best_model = model

            print(f"  [{name}] CV {metric_name}: {mean_score:.4f}")
        except Exception as e:
            print(f"  [{name}] Failed: {e}")
            all_scores[name] = 0.0

    # --- Step 6: Refit best model on full training set and evaluate on test ---
    if best_model is not None:
        best_model.fit(X_train, y_train)
        y_pred = best_model.predict(X_test)

        if task_type == "classification":
            test_score = float(accuracy_score(y_test, y_pred))
        else:
            test_score = float(r2_score(y_test, y_pred))

        test_score = round(test_score, 4)
    else:
        test_score = 0.0
        y_pred = []

    # --- Step 7: Extract feature importances ---
    feature_importances = {}
    if best_model is not None:
        if hasattr(best_model, 'feature_importances_'):
            importances = best_model.feature_importances_
            feature_importances = {
                feature_cols[i]: round(float(importances[i]), 4)
                for i in range(len(feature_cols))
            }
        elif hasattr(best_model, 'coef_'):
            coefs = best_model.coef_
            if coefs.ndim > 1:
                coefs = np.mean(np.abs(coefs), axis=0)
            else:
                coefs = np.abs(coefs)
            feature_importances = {
                feature_cols[i]: round(float(coefs[i]), 4)
                for i in range(len(feature_cols))
            }

    # --- Step 8: Compose metrics payload ---
    model_metrics = {
        "best_model_name": best_model_name,
        "best_accuracy": test_score,
        "task_type": task_type,
        "metric_name": metric_name,
        "all_model_scores": all_scores,
        "feature_importances": feature_importances,
        "target_column": target_col,
        "num_features": len(feature_cols),
        "num_samples": len(df),
        "test_plot": {
            "predicted": [round(float(p), 4) for p in y_pred[:30]]
        }
    }

    print(f"[ModelerAgent] BEST Model: {best_model_name} | Test {metric_name}: {test_score}")

    return {
        "model_metrics": model_metrics,
        "target_column": target_col,
        "logs": logs + [
            f"ModelerAgent benchmarked {len(candidates)} models. "
            f"Best: {best_model_name} ({metric_name}: {test_score})"
        ]
    }
