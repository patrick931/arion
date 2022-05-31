import nc from 'next-connect';
import Order from '../../../src/models/Order';
import { isAuth } from '../../../utils/auth';
import dbConnect from '../../../utils/dbConnect';
import { onError } from '../../../utils/errors';

const handler = nc({ onError });
handler.use(isAuth);

handler.get(async (req, res) => {
  await dbConnect.connect();
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;
