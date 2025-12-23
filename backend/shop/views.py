from django.views.decorators.csrf import csrf_exempt
import json
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

@csrf_exempt
def add_to_cart(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    cart = get_or_create_cart(request)

    data = json.loads(request.body)
    product_id = data.get("productId")
    quantity = int(data.get("quantity", 1))

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # check if item already in cart
    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity}
    )

    if not created:
        item.quantity += quantity
        item.save()

    return JsonResponse({"success": True})
