from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='product_list'), # home page route for "all products"
    path('cart/', views.get_cart, name="get_cart"),
    path('cart/add/', views.add_to_cart, name="add_to_cart"),
    path('cart/item/<int:item_id>/', views.update_cart_item, name="update_cart_item")
]
