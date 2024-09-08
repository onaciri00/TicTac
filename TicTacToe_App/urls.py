from django.urls import path
from .views import store_result 

urlpatterns = [
    path('api/store-result/', store_result, name='store_result'),
]