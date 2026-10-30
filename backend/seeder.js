import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    address: 'Tech Park Boulevard',
    city: 'Bengaluru',
    postal_code: '560100',
    country: 'India',
    phone_number: '+91 9876500000',
  },
  {
    name: 'John Doe',
    username: 'john',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    address: '123 MG Road, Indiranagar',
    city: 'Bengaluru',
    postal_code: '560038',
    country: 'India',
    phone_number: '+91 9876543210',
  },
  {
    name: 'Jane Smith',
    username: 'jane',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    address: '45 Marine Drive',
    city: 'Mumbai',
    postal_code: '400020',
    country: 'India',
    phone_number: '+91 9876543211',
  },
  {
    name: 'Rahul Sharma',
    username: 'rahul',
    email: 'rahul@example.com',
    password: 'password123',
    isAdmin: false,
    address: '78 Connaught Place',
    city: 'New Delhi',
    postal_code: '110001',
    country: 'India',
    phone_number: '+91 9876543212',
  },
];

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    brand: 'Sony',
    category: 'Electronics',
    description: 'Industry-leading noise cancellation with two processors and eight microphones. Exceptional sound quality with High-Resolution Audio and crystal-clear hands-free calling.',
    rating: 4.8,
    num_reviews: 12,
    price: 24999.0,
    count_in_stock: 15,
  },
  {
    name: 'Apple MacBook Air 15" M3 Chip',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    brand: 'Apple',
    category: 'Electronics',
    description: 'Supercharged by the next-generation M3 chip, MacBook Air delivers incredible performance and up to 18 hours of battery life in a remarkably thin aluminum design.',
    rating: 4.9,
    num_reviews: 24,
    price: 134900.0,
    count_in_stock: 8,
  },
  {
    name: 'Classic Minimalist Chronograph Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    brand: 'Fossil',
    category: 'Accessories',
    description: 'Elegant stainless steel wrist watch with genuine leather strap, water resistance up to 50m, and sapphire crystal glass for scratch resistance.',
    rating: 4.6,
    num_reviews: 8,
    price: 8999.0,
    count_in_stock: 25,
  },
  {
    name: 'Urban Streetwear Premium Cotton Hoodie',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    brand: 'Nike',
    category: 'Fashion',
    description: 'Soft brushed-back fleece hoodie designed for everyday comfort. Features an adjustable drawstring hood, kangaroo pocket, and ribbed cuffs.',
    rating: 4.5,
    num_reviews: 15,
    price: 3499.0,
    count_in_stock: 30,
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera 4K',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    brand: 'Canon',
    category: 'Electronics',
    description: 'Compact and lightweight mirrorless camera featuring 24.2 Megapixel CMOS sensor, Dual Pixel CMOS AF II, and uncropped 4K video recording up to 30p.',
    rating: 4.7,
    num_reviews: 10,
    price: 65990.0,
    count_in_stock: 6,
  },
  {
    name: 'Atomic Habits by James Clear',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    brand: 'Penguin Random House',
    category: 'Books',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Millions of copies sold worldwide with actionable frameworks for continuous personal transformation.',
    rating: 4.9,
    num_reviews: 45,
    price: 499.0,
    count_in_stock: 50,
  },
  {
    name: 'Ergonomic Breathable Mesh Office Chair',
    image: 'https://images.unsplash.com/photo-1580481077197-c819c968f237?w=800&auto=format&fit=crop&q=80',
    brand: 'Green Soul',
    category: 'Home',
    description: 'High back ergonomic chair with 3D adjustable armrests, lumbar support, multi-lock synchro tilt mechanism, and heavy-duty nylon base.',
    rating: 4.6,
    num_reviews: 18,
    price: 14999.0,
    count_in_stock: 12,
  },
  {
    name: 'Polarized UV Protection Aviator Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    brand: 'Ray-Ban',
    category: 'Accessories',
    description: 'Iconic aviator design with polarized crystal green lenses offering 100% UV protection and a durable lightweight gold metal frame.',
    rating: 4.7,
    num_reviews: 22,
    price: 7590.0,
    count_in_stock: 18,
  },
  {
    name: 'Smart Stainless Steel Pour-Over Coffee Kettle',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    brand: 'Fellow',
    category: 'Home',
    description: 'Precision gooseneck kettle with variable temperature control, LCD display screen, 60-minute hold mode, and balanced counterweight handle.',
    rating: 4.8,
    num_reviews: 14,
    price: 11999.0,
    count_in_stock: 10,
  },
  {
    name: 'Men Slim Fit Premium Linen Casual Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    brand: 'Zara',
    category: 'Fashion',
    description: '100% pure breathable linen shirt crafted for warm weather comfort. Features spread collar, curved hemline, and button-through placket.',
    rating: 4.4,
    num_reviews: 9,
    price: 2990.0,
    count_in_stock: 20,
  },
  {
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    brand: 'Keychron',
    category: 'Electronics',
    description: '75% compact wireless mechanical keyboard with Gateron G Pro mechanical switches, RGB backlighting, and Bluetooth 5.1 dual connectivity.',
    rating: 4.8,
    num_reviews: 28,
    price: 7999.0,
    count_in_stock: 14,
  },
  {
    name: 'The Psychology of Money by Morgan Housel',
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
    brand: 'Jaico Publishing',
    category: 'Books',
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.',
    rating: 4.9,
    num_reviews: 38,
    price: 399.0,
    count_in_stock: 40,
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old collections...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Creating sample users...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const adminUser = createdUsers[0];
    const johnUser = createdUsers[1];
    const janeUser = createdUsers[2];
    const rahulUser = createdUsers[3];

    console.log('[Seeder] Creating sample products...');
    const createdProducts = [];
    for (const p of sampleProducts) {
      const prod = await Product.create({
        ...p,
        user: adminUser._id,
      });
      createdProducts.push(prod);
    }

    console.log('[Seeder] Adding realistic product reviews...');
    createdProducts[0].reviews.push({
      name: johnUser.name,
      rating: 5,
      comment: 'Absolutely top notch noise cancellation! Best headphones I have ever owned.',
      user: johnUser._id,
    });
    createdProducts[0].reviews.push({
      name: janeUser.name,
      rating: 5,
      comment: 'Super lightweight and the soundstage is remarkable for working long hours.',
      user: janeUser._id,
    });
    await createdProducts[0].save();

    createdProducts[1].reviews.push({
      name: rahulUser.name,
      rating: 5,
      comment: 'Blazing fast battery life and featherlight design. Perfect for developer productivity.',
      user: rahulUser._id,
    });
    await createdProducts[1].save();

    console.log('[Seeder] Creating sample orders...');
    // Order 1: John's paid & delivered order
    await Order.create({
      user: johnUser._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          quantity: 1,
          qty: 1,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
        {
          name: createdProducts[5].name,
          quantity: 2,
          qty: 2,
          image: createdProducts[5].image,
          price: createdProducts[5].price,
          product: createdProducts[5]._id,
        },
      ],
      shippingAddress: {
        address: johnUser.address,
        city: johnUser.city,
        postal_code: johnUser.postal_code,
        postalCode: johnUser.postal_code,
        country: johnUser.country,
        shipping_price: 0,
      },
      payment_method: 'Credit Card / UPI',
      tax_price: Math.round(createdProducts[0].price * 0.18 * 100) / 100,
      shipping_price: 0,
      total_price:
        createdProducts[0].price +
        createdProducts[5].price * 2 +
        Math.round(createdProducts[0].price * 0.18 * 100) / 100,
      is_paid: true,
      paid_at: new Date(Date.now() - 86400000 * 3),
      is_delivered: true,
      delivered_at: new Date(Date.now() - 86400000 * 1),
    });

    // Order 2: Jane's paid order (processing delivery)
    await Order.create({
      user: janeUser._id,
      orderItems: [
        {
          name: createdProducts[2].name,
          quantity: 1,
          qty: 1,
          image: createdProducts[2].image,
          price: createdProducts[2].price,
          product: createdProducts[2]._id,
        },
      ],
      shippingAddress: {
        address: janeUser.address,
        city: janeUser.city,
        postal_code: janeUser.postal_code,
        postalCode: janeUser.postal_code,
        country: janeUser.country,
        shipping_price: 0,
      },
      payment_method: 'Net Banking',
      tax_price: Math.round(createdProducts[2].price * 0.18 * 100) / 100,
      shipping_price: 0,
      total_price:
        createdProducts[2].price +
        Math.round(createdProducts[2].price * 0.18 * 100) / 100,
      is_paid: true,
      paid_at: new Date(Date.now() - 86400000 * 1),
      is_delivered: false,
    });

    console.log('✅ [Seeder] Database Seeded Successfully with MongoDB Collections!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Clearing all collections...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ [Seeder] Data Destroyed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
