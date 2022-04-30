import nc from 'next-connect';
import Product from '../../../models/Product';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newProduct = new Product({
    name: req.body.name,
    slug: req.body.slug,
  });
  const product = await newProduct.save();
  await dbConnect.disconnect();
  res.send({
    _id: product._id,
    name: product.name,
    slug: product.slug,
  });
});

export default handler;
