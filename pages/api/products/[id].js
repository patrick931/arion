import nc from 'next-connect';
import Product from '../../../src/models/Product';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  const product = await Product.findById(req.query.id);
  await dbConnect.disconnect();
  res.send(product);
});

export default handler;
