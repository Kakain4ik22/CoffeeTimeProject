# CoffeeTime Project

## Как запустить проект

## Установка и запуск

### Бэкенд (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Фронтенд (React)
cd frontend
npm install
npm start