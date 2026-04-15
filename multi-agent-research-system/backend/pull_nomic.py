import ollama
import sys

def main():
    print("Connecting to Ollama to pull 'nomic-embed-text' model...")
    try:
        ollama.pull("nomic-embed-text")
        print("Successfully pulled nomic-embed-text!")
    except Exception as e:
        print(f"Error pulling model: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
