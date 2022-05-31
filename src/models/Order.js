import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: [
      {
        imageUrl: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        taxRate: { type: Number, required: true },
        productDiscountRate: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressline1: { type: String, required: true },
      addressline2: { type: String, required: true },
      mobile: { type: String, required: true },
      postalAddress: { type: String, required: true },
      city: { type: String, required: true },
      county: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    subTotalPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

