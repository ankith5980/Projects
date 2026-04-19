Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\ankit\Desktop\Projects\ai-fraud-detection\frontend; npm run dev`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\ankit\Desktop\Projects\ai-fraud-detection; .\venv\Scripts\activate; python backend\main.py`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\ankit\Desktop\Projects\ai-fraud-detection; .\venv\Scripts\activate; python backend\streaming\consumer.py`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\ankit\Desktop\Projects\ai-fraud-detection; .\venv\Scripts\activate; python backend\streaming\producer.py`""
