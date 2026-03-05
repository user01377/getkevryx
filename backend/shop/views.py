from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *

def product_list(request):
    products = Product.objects.all().values()
    return JsonResponse(list(products), safe=False)

def product_view(request, slug):
    # returns the product details based on its slug
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    data = {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "description": product.description,
        "price": str(product.price),
        "image_url": product.image_url,
        "colors": product.colors,
        "category": product.category,
        "stock": product.stock,
        "created_at": product.created_at.isoformat(),
    }

    return JsonResponse(data)


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

def get_cart(request):
    
    cart = get_or_create_cart(request)

    items = cart.items.select_related("product")

    data = []
    for item in items:
        data.append({
            "id": item.id,
            "productId": item.product.id,
            "name": item.product.name,
            "price": str(item.product.price),
            "image_url": item.product.image_url,
            "quantity": item.quantity,
            "added_at": item.added_at.isoformat()
        })

    return JsonResponse({"items": data})

@csrf_exempt
def update_cart_item(request, item_id):
    cart = get_or_create_cart(request)

    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)

    if request.method == "PATCH":
        data = json.loads(request.body)
        item.quantity = int(data.get("quantity", item.quantity))
        item.save()
        return JsonResponse({"success": True})
    
    elif request.method == "DELETE":
        item.delete()
        return JsonResponse({"success": True})
    
    return JsonResponse({"error": "Method not allowed"}, status=405)