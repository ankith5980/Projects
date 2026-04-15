import ollama
try:
    models = ollama.list()
    print("Available models:")
    for model in models.get("models", []):
        print(f" - {model['name']}")
except Exception as e:
    print(f"Error checking models: {e}")
