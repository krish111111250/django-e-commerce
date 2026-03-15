import os
import sys
import json
import django
from datetime import datetime
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Product, Category, Order, Review
from django.contrib.auth.models import User

def run():
    print("Starting custom data load...")
    try:
        with open('backup_data.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("backup_data.json not found.")
        return

    # 1. Categories
    print("Loading Categories...")
    category_map = {} # old_id -> new_instance
    for cat_data in data.get('categories', []):
        try:
            cat, created = Category.objects.get_or_create(
                _id=cat_data.get('id'),
                defaults={'name': cat_data.get('name')}
            )
            if not created:
                cat.name = cat_data.get('name')
                cat.save()
            category_map[cat_data.get('id')] = cat
            print(f"Processed Category: {cat.name}")
        except Exception as e:
            print(f"Error processing category {cat_data}: {e}")

    # 2. Products
    print("Loading Products...")
    for prod_data in data.get('products', []):
        try:
            cat_id = prod_data.get('category_id')
            category = category_map.get(cat_id)
            
            p, created = Product.objects.get_or_create(
                _id=prod_data.get('id')
            )
            
            p.name = prod_data.get('name')
            p.description = prod_data.get('description')
            p.price = prod_data.get('price')
            p.countInStock = prod_data.get('stock', 0)
            p.stock = prod_data.get('stock', 0) # Mapping both just in case
            p.category = category
            p.rating = prod_data.get('rating')
            
            if prod_data.get('image_url'):
                 # Ensure image path is relative if needed or just store string
                 p.image = prod_data.get('image_url')
            
            if prod_data.get('created_at'):
                 try:
                     # Attempt to parse specific format seen: "2026-02-05 08:50:03.638448"
                     p.createdAt = prod_data.get('created_at')
                 except:
                     pass
            
            p.save()
            print(f"Processed Product: {p.name}")
        except Exception as e:
            print(f"Error processing product {prod_data.get('name')}: {e}")

    print("Data load complete.")

if __name__ == '__main__':
    run()
