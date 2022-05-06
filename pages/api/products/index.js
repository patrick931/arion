import nc from 'next-connect';
import Product from '../../../src/models/Product';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  const products = await Product.find({});
  await dbConnect.disconnect();
  res.send(products);
});

export default handler;
