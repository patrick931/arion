import nc from 'next-connect';
import User from '../../../src/models/User';
import dbConnect from '../../../utils/dbConnect';
import bcrypt from 'bcryptjs';
import { isAuth, signToken } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await dbConnect.connect();
    const user = await User.findById(req.user._id);

    (user.firstName = req.body.firstName),
      (user.lastName = req.body.lastName),
      (user.email = req.body.email),
      (user.mobile = req.body.mobile),
      (user.password = req.body.password
        ? bcrypt.hashSync(req.body.password)
        : user.password);
    // user.avatar = req.body.avatar;
    await user.save();

    await dbConnect.disconnect();

    const token = signToken(user);
    res.status(200).json({
      message: 'Updated Succesfully',
      UpdatedUser: {
        token,
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error Updating User Details',
    });
  }
});

export default handler;
