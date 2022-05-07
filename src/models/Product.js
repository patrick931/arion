import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'Please enter an sku'],
      unique: [true, 'Please enter unique sku code'],
      minlength: [6, 'Minimum sku length must be 6 characters'],
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      unique: [true, 'Please enter unique product name'],
      maxlength: [20, 'Max product name length must be 20 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
      maxlength: [200, 'Max product description length is 200 characters'],
    },
    productCategory: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: [true, 'Please enter a product type'],
    },
    brand: {
      type: String,
      required: [true, 'Please enter a product brand'],
      default: 'default brand',
    },
    buyingPrice: {
      type: Number,
      required: [true, 'Please enter a buying price'],
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please enter a selling price'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please enter a count in stock'],
      default: 0,
    },
    taxRate: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
    rating: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
