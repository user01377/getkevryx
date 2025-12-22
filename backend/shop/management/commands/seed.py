import json
import os
from django.core.management.base import BaseCommand
from shop.models import Product
from django.conf import settings

class Command(BaseCommand):
    help = "Seed baseline product data from JSON file"

    def handle(self, *args, **options):
        # Path to JSON file
        json_file_path = os.path.join(
            settings.BASE_DIR, "shop", "fixtures", "data.json"
        )

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"JSON file not found: {json_file_path}"))
            return

        # Load JSON data
        with open(json_file_path, "r") as f:
            products = json.load(f)

        created_count = 0
        updated_count = 0

        for product in products:
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
            self.style.SUCCESS(f"Seed complete: {created_count} created, {updated_count} updated")
        )
