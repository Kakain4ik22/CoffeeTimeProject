# CoffeeTime Project

## Как запустить проект

## 1. Запустить Backend (Django)

Откройте терминал и выполните:
### 1. Зайдите в папку backend
cd backend

### 2. Включите виртуальное окружение
venv\Scripts\Activate 

### 3. Установите зависимости (если requirements.txt есть)
pip install -r requirements.txt

### 4. Настройте базу данных
python manage.py migrate

### 5. Запустите сервер
python manage.py runserver


## 2. Запустить Frontend (React)

### 1. Вернитесь в корневую папку (если вы в backend)
cd ..

### 2. Зайдите в папку frontend
cd frontend

### 3. Установите зависимости
npm install

### 4. Запустите React
npm run dev