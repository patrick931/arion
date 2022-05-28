import nc from 'next-connect';
import Order from '../../../../src/models/Order';
import dbConnect from '../../../../utils/dbConnect';
import { onError } from '../../../../utils/errors';
import { isAuth } from '../../../../utils/auth';

const handler = nc(onError);
handler.use(isAuth);

handler.put(async (req, res) => {
  await dbConnect.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await dbConnect.disconnect();
    res.send({ message: 'Order Paid', order: paidOrder });
  } else {
    await dbConnect.disconnect();
    res.statusCode(404).send({ message: 'Order not found' });
  }
});

export default handler;
