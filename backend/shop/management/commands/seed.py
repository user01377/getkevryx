from django.core.management.base import BaseCommand
from shop.models import Product

BASELINE_PRODUCTS = [
    {
        "name": "Essential Oversized Tee",
        "description": "Heavyweight cotton oversized t-shirt with a relaxed fit.",
        "colors": "black,white,stone",
        "price": "34.00",
        "stock": 120,
        "category": "tops",
        "image_url": "/images/products/oversized-tee.jpg",
    },
    {
        "name": "Relaxed Fit Hoodie",
        "description": "Midweight fleece hoodie designed for everyday wear.",
        "colors": "black,grey,forest",
        "price": "78.00",
        "stock": 60,
        "category": "outerwear",
        "image_url": "/images/products/relaxed-hoodie.jpg",
    },
    {
        "name": "Straight Leg Utility Pant",
        "description": "Durable straight-leg pants with a clean, minimal silhouette.",
        "colors": "black,olive,khaki",
        "price": "96.00",
        "stock": 45,
        "category": "bottoms",
        "image_url": "/images/products/utility-pant.jpg",
    },
]

class Command(BaseCommand):
    help = "Seed baseline product data for development and demo environments"

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for product in BASELINE_PRODUCTS:
            obj, created = Product.objects.update_or_create(
                name=product["name"],
                defaults={
                    "description": product["description"],
                    "colors": product["colors"],
                    "price": product["price"],
                    "stock": product["stock"],
                    "category": product["category"],
                    "image_url": product["image_url"],
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {created_count} created, {updated_count} updated"
            )
        )
