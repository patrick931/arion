import nc from 'next-connect';
import User from '../../src/models/User';
import Product from '../../src/models/Product';
import dbConnect from '../../utils/dbConnect';
import data from '../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await dbConnect.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;
