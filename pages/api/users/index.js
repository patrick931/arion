import nc from 'next-connect';
import User from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect.connect();
  const users = await User.find({});
  await dbConnect.disconnect();
  res.send(users);
});

export default handler;
