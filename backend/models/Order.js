import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    qty: { type: Number, default: 1 },
    image: { type: String, default: '' },
    price: { type: Number, required: true, default: 0.0 },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.qty = ret.quantity;
        return ret;
      },
    },
  }
);

const shippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  country: { type: String, required: true },
  shipping_price: { type: Number, default: 0.0 },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    payment_method: {
      type: String,
      required: true,
      default: 'Simulated Payment',
    },
    tax_price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shipping_price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total_price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    is_paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paid_at: {
      type: Date,
    },
    is_delivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    delivered_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
