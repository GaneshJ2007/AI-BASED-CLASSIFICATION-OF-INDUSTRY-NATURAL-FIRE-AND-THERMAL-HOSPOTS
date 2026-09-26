### Backend (Terminal 1)
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
# or if preferred:
# python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

### Frontend (Terminal 2)
npm run dev


