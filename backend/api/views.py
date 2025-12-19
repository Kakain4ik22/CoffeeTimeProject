from rest_framework import status
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, PermissionDenied  # Добавьте эти импорты
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Product, Category, Order, OrderItem, Review
from rest_framework.response import Response
import json
from .serializers import *

# Регистрация
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'message': 'Пользователь успешно зарегистрирован',
            'user_id': response.data['id']
        }, status=status.HTTP_201_CREATED)

# Текущий пользователь
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# Пользователи
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

# Категории
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Продукты
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

# Заказы
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Order.objects.all().prefetch_related('orderitem_set')
        
        return Order.objects.filter(user=self.request.user).prefetch_related('orderitem_set')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    # ФИКС: Переопределяем get_object для правильной работы с правами
    def get_object(self):
        # Берем pk из URL
        pk = self.kwargs.get('pk')
        
        if pk is not None:
            try:
                # Если пользователь админ - ищем заказ среди всех
                if self.request.user.role == 'admin':
                    obj = Order.objects.get(pk=pk)
                else:
                    # Обычный пользователь - ищем только среди своих заказов
                    obj = Order.objects.get(pk=pk, user=self.request.user)
                self.check_object_permissions(self.request, obj)
                return obj
            except Order.DoesNotExist:
                # Используем правильное исключение
                raise NotFound("Заказ не найден")
        
        raise NotFound("Не указан ID заказа")
    
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        """Отменить заказ (меняем статус на cancelled)"""
        try:
            order = self.get_object()
            print(f"Cancelling order #{order.id} for user {request.user.username}")
            
            # Проверяем, можно ли отменить
            if order.status not in ['new', 'preparing']:
                return Response(
                    {'error': f'Невозможно отменить заказ со статусом "{order.status}"'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Меняем статус
            order.status = 'cancelled'
            order.save()
            print(f"Order #{order.id} cancelled successfully")
            
            return Response({
                'message': 'Заказ успешно отменен', 
                'order_id': order.id,
                'new_status': order.status
            }, status=status.HTTP_200_OK)
            
        except NotFound as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error cancelling order: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Внутренняя ошибка сервера: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def partial_update(self, request, *args, **kwargs):
        """Обновить заказ (для PATCH запросов)"""
        try:
            instance = self.get_object()
            print(f"PATCH update for order #{instance.id}")
            print(f"Request data: {request.data}")
            
            # Вызываем родительский метод
            return super().partial_update(request, *args, **kwargs)
        except Exception as e:
            print(f"PATCH error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'PATCH error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['delete'])
    def delete_order(self, request, pk=None):
        """Полностью удалить заказ (только для админов или если заказ новый)"""
        try:
            order = self.get_object()
            
            # Проверяем условия удаления
            if order.status != 'new' and request.user.role != 'admin':
                return Response(
                    {'error': 'Можно удалять только новые заказы'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order_id = order.id
            order.delete()
            
            return Response({'message': f'Заказ #{order_id} удален'})
            
        except NotFound as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error deleting order: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Ошибка при удалении заказа: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    # Стандартный метод destroy для удаления
    def destroy(self, request, *args, **kwargs):
        """Стандартный метод удаления заказа"""
        try:
            instance = self.get_object()
            order_id = instance.id
            
            # Проверяем условия удаления
            if instance.status != 'new' and request.user.role != 'admin':
                return Response(
                    {'error': 'Можно удалять только новые заказы'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            self.perform_destroy(instance)
            return Response({'message': f'Заказ #{order_id} удален'})
            
        except NotFound as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in destroy: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Ошибка при удалении заказа: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request, *args, **kwargs):
        print(f"List orders requested by user: {request.user.username}, role: {request.user.role}")
        print(f"User ID: {request.user.id}")
        
        queryset = self.filter_queryset(self.get_queryset())
        print(f"Queryset count: {queryset.count()}")
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            print(f"Returning {len(serializer.data)} orders")
            return result
        
        serializer = self.get_serializer(queryset, many=True)
        print(f"Returning {len(serializer.data)} orders (non-paginated)")
        return Response(serializer.data)
        

# Отзывы
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        print(f"Creating order for user: {self.request.user.username}")
        print(f"User ID: {self.request.user.id}")
        print(f"Order data: {serializer.validated_data}")
        
        order = serializer.save(user=self.request.user)
        print(f"Order created with ID: {order.id}, User: {order.user.username}")