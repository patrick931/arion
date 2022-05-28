import nc from 'next-connect';
import Order from '../../../../src/models/Order';
import dbConnect from '../../../../utils/dbConnect';
import { isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await dbConnect.connect();
  const order = await Order.findById(req.query.id);
  await dbConnect.disconnect();
  res.send(order);
});

export default handler;
