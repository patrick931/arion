import nc from 'next-connect';
import Product from '../../../models/Product';
import dbConnect from '../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  const products = await Product.find({});
  await dbConnect.disconnect();
  res.send(products);
});

export default handler;
