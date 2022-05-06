import nc from 'next-connect';
import Product from '../../../src/models/Product';
import { isAuth } from '../../../utils/auth';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newProduct = new Product({
    sku: req.body.sku,
    name: req.body.name,
    slug: req.body.slug,
    description: req.body.description,
    category: req.body.category,
    productType: req.body.productType,
    brand: req.body.brand,
    buyingPrice: req.body.buyingPrice,
    sellingPrice: req.body.sellingPrice,
    countInStock: req.body.countInStock,
    taxRate: req.body.taxRate,
    // imageUrl: req.body.imageUrl,
    // rating: req.body.rating,
    // numReviews: req.body.numReviews,
  });
  try {
    const product = await newProduct.save();
    await dbConnect.disconnect();
    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating product',
    });
  }
});

export default handler;
