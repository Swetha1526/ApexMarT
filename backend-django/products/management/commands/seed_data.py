from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from users.models import UserProfile
from products.models import Product, Review
from orders.models import Order, OrderItem, ShippingAddress


class Command(BaseCommand):
    help = 'Seeds database with sample users, realistic products, reviews, and orders'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Clearing existing data...'))
        Review.objects.all().delete()
        OrderItem.objects.all().delete()
        ShippingAddress.objects.all().delete()
        Order.objects.all().delete()
        Product.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        # 1. Create Admin
        self.stdout.write('Creating Admin User...')
        admin_user = User.objects.create(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            is_staff=True,
            is_superuser=True,
            password=make_password('admin123')
        )
        admin_profile, _ = UserProfile.objects.get_or_create(user=admin_user)
        admin_profile.address = 'Tech Park Boulevard'
        admin_profile.city = 'Bengaluru'
        admin_profile.postal_code = '560100'
        admin_profile.country = 'India'
        admin_profile.phone_number = '+91 9876500000'
        admin_profile.save()

        # 2. Create Sample Users
        self.stdout.write('Creating Sample Users...')
        users_data = [
            {
                'username': 'john',
                'email': 'john@example.com',
                'name': 'John Doe',
                'password': 'password123',
                'address': '123 MG Road, Indiranagar',
                'city': 'Bengaluru',
                'postal_code': '560038',
                'country': 'India',
                'phone': '+91 9876543210'
            },
            {
                'username': 'jane',
                'email': 'jane@example.com',
                'name': 'Jane Smith',
                'password': 'password123',
                'address': '45 Park Street',
                'city': 'Kolkata',
                'postal_code': '700016',
                'country': 'India',
                'phone': '+91 9876543211'
            },
            {
                'username': 'rahul',
                'email': 'rahul@example.com',
                'name': 'Rahul Sharma',
                'password': 'password123',
                'address': '78 Marine Drive',
                'city': 'Mumbai',
                'postal_code': '400020',
                'country': 'India',
                'phone': '+91 9876543212'
            }
        ]

        created_users = []
        for u in users_data:
            first, *last = u['name'].split(' ')
            user = User.objects.create(
                username=u['username'],
                email=u['email'],
                first_name=first,
                last_name=' '.join(last),
                password=make_password(u['password'])
            )
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.address = u['address']
            profile.city = u['city']
            profile.postal_code = u['postal_code']
            profile.country = u['country']
            profile.phone_number = u['phone']
            profile.save()
            created_users.append(user)

        # 3. Create Sample Products
        self.stdout.write('Creating Sample Products...')
        sample_products = [
            {
                'name': 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
                'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                'brand': 'Sony',
                'category': 'Electronics',
                'description': 'Industry-leading noise cancellation with two processors and eight microphones. Exceptional sound quality with High-Resolution Audio and crystal-clear hands-free calling.',
                'rating': Decimal('4.8'),
                'num_reviews': 12,
                'price': Decimal('24999.00'),
                'count_in_stock': 15
            },
            {
                'name': 'Apple MacBook Air 15" M3 Chip',
                'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
                'brand': 'Apple',
                'category': 'Electronics',
                'description': 'Supercharged by the next-generation M3 chip, MacBook Air delivers incredible performance and up to 18 hours of battery life in a remarkably thin aluminum design.',
                'rating': Decimal('4.9'),
                'num_reviews': 24,
                'price': Decimal('134900.00'),
                'count_in_stock': 8
            },
            {
                'name': 'Classic Minimalist Chronograph Watch',
                'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                'brand': 'Fossil',
                'category': 'Accessories',
                'description': 'Elegant stainless steel wrist watch with genuine leather strap, water resistance up to 50m, and sapphire crystal glass for scratch resistance.',
                'rating': Decimal('4.6'),
                'num_reviews': 8,
                'price': Decimal('8999.00'),
                'count_in_stock': 25
            },
            {
                'name': 'Urban Streetwear Premium Cotton Hoodie',
                'image': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
                'brand': 'Nike',
                'category': 'Fashion',
                'description': 'Soft brushed-back fleece hoodie designed for everyday comfort. Features an adjustable drawstring hood, kangaroo pocket, and ribbed cuffs.',
                'rating': Decimal('4.5'),
                'num_reviews': 15,
                'price': Decimal('3499.00'),
                'count_in_stock': 30
            },
            {
                'name': 'Canon EOS R50 Mirrorless Camera 4K',
                'image': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
                'brand': 'Canon',
                'category': 'Electronics',
                'description': 'Compact and lightweight mirrorless camera featuring 24.2 Megapixel CMOS sensor, Dual Pixel CMOS AF II, and uncropped 4K video recording up to 30p.',
                'rating': Decimal('4.7'),
                'num_reviews': 10,
                'price': Decimal('65990.00'),
                'count_in_stock': 6
            },
            {
                'name': 'Atomic Habits by James Clear',
                'image': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
                'brand': 'Penguin Random House',
                'category': 'Books',
                'description': 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Millions of copies sold worldwide with actionable frameworks for continuous personal transformation.',
                'rating': Decimal('4.9'),
                'num_reviews': 45,
                'price': Decimal('499.00'),
                'count_in_stock': 50
            },
            {
                'name': 'Ergonomic Breathable Mesh Office Chair',
                'image': 'https://images.unsplash.com/photo-1580481077197-c819c968f237?w=800&auto=format&fit=crop&q=80',
                'brand': 'Green Soul',
                'category': 'Home',
                'description': 'High back ergonomic chair with 3D adjustable armrests, lumbar support, multi-lock synchro tilt mechanism, and heavy-duty nylon base.',
                'rating': Decimal('4.6'),
                'num_reviews': 18,
                'price': Decimal('14999.00'),
                'count_in_stock': 12
            },
            {
                'name': 'Polarized UV Protection Aviator Sunglasses',
                'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
                'brand': 'Ray-Ban',
                'category': 'Accessories',
                'description': 'Iconic aviator design with polarized crystal green lenses offering 100% UV protection and a durable lightweight gold metal frame.',
                'rating': Decimal('4.7'),
                'num_reviews': 22,
                'price': Decimal('7590.00'),
                'count_in_stock': 18
            },
            {
                'name': 'Smart Stainless Steel Pour-Over Coffee Kettle',
                'image': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
                'brand': 'Fellow',
                'category': 'Home',
                'description': 'Precision gooseneck kettle with variable temperature control, LCD display screen, 60-minute hold mode, and balanced counterweight handle.',
                'rating': Decimal('4.8'),
                'num_reviews': 14,
                'price': Decimal('11999.00'),
                'count_in_stock': 10
            },
            {
                'name': 'Men Slim Fit Premium Linen Casual Shirt',
                'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
                'brand': 'Zara',
                'category': 'Fashion',
                'description': '100% pure breathable linen shirt crafted for warm weather comfort. Features spread collar, curved hemline, and button-through placket.',
                'rating': Decimal('4.4'),
                'num_reviews': 9,
                'price': Decimal('2990.00'),
                'count_in_stock': 20
            },
            {
                'name': 'Keychron K2 Wireless Mechanical Keyboard',
                'image': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
                'brand': 'Keychron',
                'category': 'Electronics',
                'description': '75% compact wireless mechanical keyboard with Gateron G Pro mechanical switches, RGB backlighting, and Bluetooth 5.1 dual connectivity.',
                'rating': Decimal('4.8'),
                'num_reviews': 28,
                'price': Decimal('7999.00'),
                'count_in_stock': 14
            },
            {
                'name': 'The Psychology of Money by Morgan Housel',
                'image': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
                'brand': 'Jaico Publishing',
                'category': 'Books',
                'description': 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.',
                'rating': Decimal('4.9'),
                'num_reviews': 38,
                'price': Decimal('399.00'),
                'count_in_stock': 40
            }
        ]

        created_products = []
        for p_data in sample_products:
            prod = Product.objects.create(
                user=admin_user,
                **p_data
            )
            created_products.append(prod)

        # 4. Add Reviews
        self.stdout.write('Adding Product Reviews...')
        review_comments = [
            (created_users[0], 5, "Absolutely top notch quality! Exceeded my expectations in every way."),
            (created_users[1], 5, "Super fast delivery and the packaging was immaculate. 10/10 recommend."),
            (created_users[2], 4, "Great product for the price point. Minor learning curve but works like a charm.")
        ]
        for prod in created_products[:4]:
            for user, rating, comment in review_comments:
                Review.objects.create(
                    product=prod,
                    user=user,
                    name=f"{user.first_name} {user.last_name}",
                    rating=rating,
                    comment=comment
                )

        # 5. Create 5 Sample Orders
        self.stdout.write('Creating Sample Orders...')
        orders_configs = [
            {
                'user': created_users[0], # John Doe
                'items': [
                    (created_products[0], 1), # Sony Headphones
                    (created_products[3], 2), # Hoodie
                ],
                'is_paid': True,
                'days_ago_paid': 5,
                'is_delivered': True,
                'days_ago_delivered': 2,
                'address': created_users[0].profile.address,
                'city': created_users[0].profile.city,
                'postal_code': created_users[0].profile.postal_code,
                'country': created_users[0].profile.country
            },
            {
                'user': created_users[0], # John Doe
                'items': [
                    (created_products[5], 1), # Atomic Habits
                    (created_products[11], 1), # Psychology of Money
                ],
                'is_paid': True,
                'days_ago_paid': 1,
                'is_delivered': False,
                'days_ago_delivered': None,
                'address': created_users[0].profile.address,
                'city': created_users[0].profile.city,
                'postal_code': created_users[0].profile.postal_code,
                'country': created_users[0].profile.country
            },
            {
                'user': created_users[1], # Jane Smith
                'items': [
                    (created_products[1], 1), # MacBook Air
                ],
                'is_paid': True,
                'days_ago_paid': 7,
                'is_delivered': True,
                'days_ago_delivered': 4,
                'address': created_users[1].profile.address,
                'city': created_users[1].profile.city,
                'postal_code': created_users[1].profile.postal_code,
                'country': created_users[1].profile.country
            },
            {
                'user': created_users[1], # Jane Smith
                'items': [
                    (created_products[2], 1), # Watch
                    (created_products[7], 1), # Sunglasses
                ],
                'is_paid': False,
                'days_ago_paid': None,
                'is_delivered': False,
                'days_ago_delivered': None,
                'address': created_users[1].profile.address,
                'city': created_users[1].profile.city,
                'postal_code': created_users[1].profile.postal_code,
                'country': created_users[1].profile.country
            },
            {
                'user': created_users[2], # Rahul Sharma
                'items': [
                    (created_products[6], 1), # Office Chair
                    (created_products[10], 1), # Keychron Keyboard
                ],
                'is_paid': True,
                'days_ago_paid': 3,
                'is_delivered': False,
                'days_ago_delivered': None,
                'address': created_users[2].profile.address,
                'city': created_users[2].profile.city,
                'postal_code': created_users[2].profile.postal_code,
                'country': created_users[2].profile.country
            },
        ]

        now = timezone.now()
        for idx, cfg in enumerate(orders_configs):
            items_price = Decimal('0.00')
            for prod, qty in cfg['items']:
                items_price += prod.price * qty

            shipping_price = Decimal('0.00') if items_price > 1000 else Decimal('150.00')
            tax_price = round(items_price * Decimal('0.18'), 2)
            total_price = items_price + shipping_price + tax_price

            order = Order.objects.create(
                user=cfg['user'],
                payment_method='Credit Card / Net Banking (Simulated)',
                tax_price=tax_price,
                shipping_price=shipping_price,
                total_price=total_price,
                is_paid=cfg['is_paid'],
                paid_at=(now - timedelta(days=cfg['days_ago_paid'])) if cfg['days_ago_paid'] else None,
                is_delivered=cfg['is_delivered'],
                delivered_at=(now - timedelta(days=cfg['days_ago_delivered'])) if cfg['days_ago_delivered'] else None,
            )

            ShippingAddress.objects.create(
                order=order,
                address=cfg['address'],
                city=cfg['city'],
                postal_code=cfg['postal_code'],
                country=cfg['country'],
                shipping_price=shipping_price
            )

            for prod, qty in cfg['items']:
                OrderItem.objects.create(
                    order=order,
                    product=prod,
                    name=prod.name,
                    quantity=qty,
                    price=prod.price,
                    image=prod.image
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded all users, products, reviews, and orders!'))
