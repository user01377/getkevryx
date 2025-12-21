from django.contrib import admin
from .models import Product

class DataAdmin(admin.ModelAdmin):
    list_display = ("name", "description","price", "stock", "category")
    search_fields = ("name," "category")