from django.urls import path
from . import views

urlpatterns = [
    # --- Product URLs ---
    path('products/', views.get_products, name="products"),
    path('products/create/', views.createProduct, name="product-create"),
    path('products/delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('products/update/<str:pk>/', views.updateProduct, name="product-update"),
    path('products/upload/', views.upload_image, name="image-upload"),
    path('products/<str:pk>/reviews/', views.create_product_review, name="create-review"),
    path('products/<str:pk>/reviews/update/', views.update_review, name="update-review"),
    path('products/<str:pk>/reviews/delete/', views.delete_review, name="delete-review"),
    path('products/<str:pk>/', views.get_product, name="product"),

    # --- Category URLs ---
    path('categories/', views.get_categories, name='categories'),

    # --- Order URLs ---
    path('orders/add/', views.create_order, name='order-add'),
    path('orders/myorders/', views.get_my_orders, name='my-orders'),
    path('orders/all/', views.get_all_orders, name='all-orders'),
    path('orders/<str:pk>/pay/', views.update_order_to_paid, name='pay'),
    path('orders/<str:pk>/deliver/', views.update_order_to_delivered, name='order-deliver'),
    path('orders/<str:pk>/ship/', views.update_order_to_shipped, name='order-ship'),
    path('orders/<str:pk>/cancel/', views.cancel_order, name='order-cancel'),
    path('orders/<str:pk>/', views.get_order_by_id, name='user-order'),

    # --- Wishlist URLs ---
    path('wishlist/', views.get_wishlist, name='wishlist'),
    path('wishlist/add/<str:pk>/', views.add_to_wishlist, name='wishlist-add'),
    path('wishlist/remove/<str:pk>/', views.remove_from_wishlist, name='wishlist-remove'),

    # --- Dashboard URL ---
    path('dashboard/', views.get_dashboard_stats, name='dashboard'),
]