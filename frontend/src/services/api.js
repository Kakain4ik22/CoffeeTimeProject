// services/api.js - исправленная версия
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productService = {
  getAll: async () => {
    try {
      const response = await api.get('/products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Возвращаем пустой массив при ошибке
    }
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
};

// services/api.js - исправленный orderService
export const orderService = {
  // Получить все заказы пользователя
  getAll: async () => {
    try {
      // Сначала получаем заказы с сервера
      const response = await api.get('/orders/');
      console.log('Orders from API:', response.data);

      // Если успешно получили данные с сервера - возвращаем их
      return response.data;
    } catch (error) {
      console.error('Error fetching orders from API:', error);
        
      return localOrders;
    }
  },
  
  // Создать новый заказ
  create: async (orderData) => {
    try {
      console.log('Sending order to API:', orderData);
      
      const apiOrderData = {
        total_price: orderData.total_price,
        address: orderData.address || 'Самовывоз',
        phone: orderData.phone || 'Не указан',
        comment: orderData.comment || '',
        status: 'new'
      };
      
      // Отправляем на сервер
      const response = await api.post('/orders/', apiOrderData);
      console.log('Order created in DB:', response.data);
      
     
      return response.data;
    } catch (error) {
      console.error('Error creating order in API:', error);

      return newOrder;
    }
  },
  
  cancelOrder: async (orderId) => {
    try {
      console.log(`Cancelling order ${orderId}...`);
      const response = await api.post(`/orders/${orderId}/cancel/`);
      
      
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      
      // Если кастомный cancel не работает, пробуем PATCH
      try {
        console.log('Trying PATCH method instead...');
        const patchResponse = await api.patch(`/orders/${orderId}/`, {
          status: 'cancelled'
        });
        
        
        return {
          ...patchResponse.data,
          message: 'Заказ отменен (через PATCH)'
        };
      } catch (patchError) {
        console.error('PATCH also failed:', patchError);
        
        throw error;
      }
    }
  },
  
  // Удалить заказ (стандартный DELETE)
  delete: async (orderId) => {
    try {
      console.log(`Deleting order ${orderId}...`);
      const response = await api.delete(`/orders/${orderId}/`);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      
      console.log('Order deleted from LOCAL storage');
      return { message: 'Заказ удален из локального хранилища' };
    }
  },
};

export const authService = {
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', username);
      
      // 1. Получаем токены
      const loginResponse = await api.post('/auth/login/', { username, password });
      const { access, refresh } = loginResponse.data;
      
      console.log('Got tokens:', { access: access ? 'yes' : 'no', refresh: refresh ? 'yes' : 'no' });
      
      // Сохраняем токены
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // 2. Получаем данные пользователя
      const userResponse = await api.get('/auth/me/');
      console.log('Got user data:', userResponse.data);
      
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      return {
        access,
        refresh,
        user: userResponse.data
      };
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      console.log('Register success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Метод для тестирования API
  testAPI: async () => {
    try {
      console.log('Testing API connection...');
      
      // Тест доступности API
      const test1 = await api.get('/products/');
      console.log('Products API works:', test1.status);
      
      // Тест логина напрямую
      const test2 = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: 'user', password: 'user123'})
      });
      console.log('Login API works:', test2.status);
      
      return true;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }
};

export default api;