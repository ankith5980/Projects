import os
import shutil
from langchain_community.document_loaders import (
    DirectoryLoader, 
    PyPDFLoader, 
    TextLoader,
    CSVLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredPowerPointLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

# Use a lightweight, purpose-built embedding model for fast vectorization.
EMBED_MODEL = "nomic-embed-text"

def ingest_folder(folder_path: str, index_path: str = "faiss_index"):
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return False

    pdf_loader = DirectoryLoader(folder_path, glob="**/*.pdf", loader_cls=PyPDFLoader, use_multithreading=True)
    txt_loader = DirectoryLoader(folder_path, glob="**/*.txt", loader_cls=TextLoader, use_multithreading=True)
    csv_loader = DirectoryLoader(folder_path, glob="**/*.csv", loader_cls=CSVLoader, use_multithreading=True)
    docx_loader = DirectoryLoader(folder_path, glob="**/*.docx", loader_cls=UnstructuredWordDocumentLoader, use_multithreading=True)
    doc_loader = DirectoryLoader(folder_path, glob="**/*.doc", loader_cls=UnstructuredWordDocumentLoader, use_multithreading=True)
    pptx_loader = DirectoryLoader(folder_path, glob="**/*.pptx", loader_cls=UnstructuredPowerPointLoader, use_multithreading=True)
    ppt_loader = DirectoryLoader(folder_path, glob="**/*.ppt", loader_cls=UnstructuredPowerPointLoader, use_multithreading=True)

    documents = []
    
    loaders = [
        ("PDFs", pdf_loader),
        ("TXTs", txt_loader),
        ("CSVs", csv_loader),
        ("Word Docs (.docx)", docx_loader),
        ("Word Docs (.doc)", doc_loader),
        ("PowerPoints (.pptx)", pptx_loader),
        ("PowerPoints (.ppt)", ppt_loader)
    ]

    for name, loader in loaders:
        try:
            print(f"Loading {name}...")
            docs = loader.load()
            documents.extend(docs)
            print(f"Loaded {len(docs)} from {name}.")
        except Exception as e:
            print(f"Error loading {name}: {e}")

    if not documents:
        print("No documents found to ingest.")
        return False

    print(f"Splitting {len(documents)} documents...")
    # Larger chunks = fewer embedding calls = much faster ingestion
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    print(f"Created {len(texts)} chunks.")

    embeddings = OllamaEmbeddings(model=EMBED_MODEL)

    # Clear old index to prevent duplicates on re-ingest
    if os.path.exists(index_path):
        print("Clearing old FAISS index...")
        shutil.rmtree(index_path)

    print(f"Building FAISS index from {len(texts)} chunks. Please wait...")
    vectorstore = FAISS.from_documents(texts, embeddings)

    vectorstore.save_local(index_path)
    print(f"Successfully saved FAISS index to {index_path}")
    return True

def get_retriever(index_path: str = "faiss_index"):
    if not os.path.exists(index_path) or not os.path.exists(os.path.join(index_path, "index.faiss")):
        return None
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    return vectorstore.as_retriever(search_kwargs={"k": 4})
