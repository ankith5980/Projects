from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import pandas as pd
import hashlib

class PrivacyService:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()
        # Keep a locally stored map to de-mask when responding to trusted frontend
        self.masking_ledger = {}

    def mask_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Scans a dataframe column by column for PII and masks it.
        We capture the mapping in self.masking_ledger.
        """
        masked_df = df.copy()
        for col in masked_df.columns:
            # We convert everything to strings to analyze
            sample = " ".join(masked_df[col].dropna().astype(str).head(100).tolist())
            results = self.analyzer.analyze(text=sample, entities=["PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER"], language='en')
            
            if results:
                print(f"Masking column: {col}")
                # Simple implementation: If PII found in column, hash it all and keep a ledger
                def mask_value(x):
                    x_str = str(x)
                    hash_val = hashlib.sha256(x_str.encode()).hexdigest()[:12]
                    self.masking_ledger[hash_val] = x_str
                    return f"MASKED_{hash_val}"
                
                masked_df[col] = masked_df[col].apply(mask_value)
                
        return masked_df

    def unmask_data(self, masked_val: str) -> str:
        """
        Retrieves the original value from the masking ledger
        """
        if masked_val.startswith("MASKED_"):
            hash_val = masked_val.replace("MASKED_", "")
            return self.masking_ledger.get(hash_val, masked_val)
        return masked_val

privacy_service = PrivacyService()
