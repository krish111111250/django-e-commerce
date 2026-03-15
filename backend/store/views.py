from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
import os

from .models import Product, Order, OrderItem, ShippingAddress, Review, Category, Wishlist
from .serializers import (
    ProductSerializer, OrderSerializer, OrderItemSerializer,
    ShippingAddressSerializer, ReviewSerializer, CategorySerializer,
    WishlistSerializer
)

@api_view(['GET'])
def get_products(request):
    try:
        query = request.query_params.get('keyword', '')
        category_id = request.query_params.get('category', '')
        min_price = request.query_params.get('min_price', '')
        max_price = request.query_params.get('max_price', '')
        sort = request.query_params.get('sort', '')
        products = Product.objects.all()
        if query:
            products = products.filter(name__icontains=query)
        if category_id:
            products = products.filter(category___id=category_id)
        if min_price:
            products = products.filter(price__gte=float(min_price))
        if max_price:
            products = products.filter(price__lte=float(max_price))
        if sort == 'price_low':
            products = products.order_by('price')
        elif sort == 'price_high':
            products = products.order_by('-price')
        elif sort == 'rating':
            products = products.order_by('-rating')
        else:
            products = products.order_by('-createdAt')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    try:
        product = Product.objects.create(
            user=request.user,
            name='Sample Product',
            price=0,
            brand='Sample Brand',
            description='Sample Description',
            countInStock=0,
            stock=0,
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        data = request.data
        product = Product.objects.get(_id=pk)
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.brand = data.get('brand', product.brand)
        product.description = data.get('description', product.description)
        product.countInStock = data.get('countInStock', product.countInStock)
        product.stock = data.get('stock', product.stock)
        category_id = data.get('category', None)
        if category_id:
            try:
                category = Category.objects.get(_id=category_id)
                product.category = category
            except Category.DoesNotExist:
                pass
        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({'detail': 'Product deleted'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def upload_image(request):
    try:
        product_id = request.data.get('product_id')
        product = Product.objects.get(_id=product_id)
        image = request.FILES.get('image')
        if image:
            product.image = image
            product.save()
        return Response({'detail': 'Image uploaded', 'image': str(product.image)})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, pk):
    try:
        user = request.user
        product = Product.objects.get(_id=pk)
        data = request.data
        if product.review_set.filter(user=user).exists():
            return Response({'detail': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
        if not data.get('rating') or int(data['rating']) == 0:
            return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)
        Review.objects.create(
            user=user,
            product=product,
            name=user.first_name or user.email,
            rating=data['rating'],
            comment=data.get('comment', ''),
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        product.rating = sum(r.rating for r in reviews) / len(reviews)
        product.save()
        return Response({'detail': 'Review added'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, pk):
    try:
        user = request.user
        product = Product.objects.get(_id=pk)
        data = request.data
        review = product.review_set.filter(user=user).first()
        if not review:
            return Response({'detail': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        review.rating = data.get('rating', review.rating)
        review.comment = data.get('comment', review.comment)
        review.save()
        reviews = product.review_set.all()
        product.rating = sum(r.rating for r in reviews) / len(reviews)
        product.save()
        return Response({'detail': 'Review updated'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, pk):
    try:
        user = request.user
        product = Product.objects.get(_id=pk)
        review = product.review_set.filter(user=user).first()
        if not review:
            return Response({'detail': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        product.rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
        product.save()
        return Response({'detail': 'Review deleted'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_categories(request):
    try:
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        user = request.user
        data = request.data
        orderItems = data.get('orderItems', [])
        if not orderItems:
            return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod', ''),
            taxPrice=data.get('taxPrice', 0),
            shippingPrice=data.get('shippingPrice', 0),
            totalPrice=data.get('totalPrice', 0),
            status='Processing',
        )
        shipping = data.get('shippingAddress', {})
        ShippingAddress.objects.create(
            order=order,
            address=shipping.get('address', ''),
            city=shipping.get('city', ''),
            postalCode=shipping.get('postalCode', ''),
            country=shipping.get('country', ''),
            shippingPrice=data.get('shippingPrice', 0),
        )
        for item in orderItems:
            product_id = item.get('_id') or item.get('id')
            try:
                product = Product.objects.get(_id=product_id)
            except Product.DoesNotExist:
                continue
            OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item.get('qty', 1),
                price=item.get('price', 0),
                image=str(product.image) if product.image else '',
            )
            product.countInStock -= int(item.get('qty', 1))
            product.stock -= int(item.get('qty', 1))
            product.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    try:
        orders = request.user.orders.all().order_by('-createdAt')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_orders(request):
    try:
        orders = Order.objects.all().order_by('-createdAt')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)
        if not user.is_staff and order.user != user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isPaid = True
        order.paidAt = timezone.now()
        order.status = 'Paid'
        order.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isDelivered = True
        order.deliveredAt = timezone.now()
        order.status = 'Delivered'
        order.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_shipped(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.status = 'Shipped'
        order.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)
        if not user.is_staff and order.user != user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        if order.status in ['Shipped', 'Delivered']:
            return Response({'detail': 'Cannot cancel a shipped or delivered order'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'Cancelled'
        order.save()
        for item in order.orderitem_set.all():
            if item.product:
                item.product.countInStock += item.qty
                item.product.stock += item.qty
                item.product.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    try:
        wishlist = Wishlist.objects.filter(user=request.user).select_related('product')
        products = [item.product for item in wishlist]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({'detail': 'Already in wishlist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Added to wishlist'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        Wishlist.objects.filter(user=request.user, product=product).delete()
        return Response({'detail': 'Removed from wishlist'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_dashboard_stats(request):
    try:
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_users = User.objects.count()
        total_revenue = sum(float(o.totalPrice) for o in Order.objects.filter(isPaid=True) if o.totalPrice)
        return Response({
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalUsers': total_users,
            'totalRevenue': round(total_revenue, 2),
            'pendingOrders': Order.objects.filter(status='Processing').count(),
            'shippedOrders': Order.objects.filter(status='Shipped').count(),
            'deliveredOrders': Order.objects.filter(status='Delivered').count(),
            'cancelledOrders': Order.objects.filter(status='Cancelled').count(),
            'outOfStock': Product.objects.filter(stock=0).count(),
        })
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
