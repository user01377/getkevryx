from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    colors = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    image_url = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "products"


class CreatedShoppingCart(models.Model):
    session_key = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "created_shopping_carts"


class CartItem(models.Model):
    cart = models.ForeignKey(
        CreatedShoppingCart,
        on_delete=models.CASCADE,
        related_name="items",
        db_column="cart_id"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="product_id"
    )

    quantity = models.PositiveIntegerField()

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cart_items"
        unique_together = ("cart", "product")
