import ollama
import sys

def main():
    print("Pulling 'llama3.2' (3B) model — optimized for your GPU...")
    try:
        ollama.pull("llama3.2")
        print("Successfully pulled llama3.2!")
    except Exception as e:
        print(f"Error pulling model: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
