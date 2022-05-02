import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import Product from '../../../models/Product';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newOrder = new Order({
    product: req.body.product,
    quantity: req.body.quantity,
  });
  try {
    const order = await newOrder.save();
    await dbConnect.disconnect();
    res.status(201).json({
      message: 'Successfully created a order',
      newCategory: {
        product: order.product,
        quantity: order.quantity,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating a order',
    });
  }
});

export default handler;
