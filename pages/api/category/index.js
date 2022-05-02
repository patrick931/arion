import nc from 'next-connect';
import Category from '../../../models/Category';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  const categories = await Category.find({});
  await dbConnect.disconnect();
  res.send(categories);
});

export default handler;
