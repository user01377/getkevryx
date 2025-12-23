from django.db import models

class Products(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    colors = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    image_url = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.__name } \n {self.__description}"
    
    def get_image(self):
        return self.__image_url