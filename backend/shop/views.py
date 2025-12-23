from django.http import JsonResponse
from .models import *

def product_list(request):
    products = Product.objects.all().values()
    return JsonResponse(list(products), safe=False)

def get_or_create_cart(request):
    # helper which authenticates session existence, and returns cart
    if not request.session.session_key:
        request.session.create()
    
    session_key = request.session.session_key

    cart, created = CreatedShoppingCart.objects.get_or_create(
        session_key=session_key
    )

    return cart
