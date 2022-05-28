import nc from 'next-connect';
import Order from '../../../src/models/Order';
import { isAuth } from '../../../utils/auth';
import dbConnect from '../../../utils/dbConnect';
import { onError } from '../../../utils/errors';

const handler = nc({ onError });
handler.use(isAuth);

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newOrder = new Order({
    ...req.body,
    user: req.user._id,
  });
  const order = await newOrder.save();
  res.status(201).send(order);
});

export default handler;
