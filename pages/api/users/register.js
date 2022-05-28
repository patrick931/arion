import nc from 'next-connect';
import User from '../../../src/models/User';
import dbConnect from '../../../utils/dbConnect';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  try {
    const user = await newUser.save();
    await dbConnect.disconnect();

    const token = signToken(user);
    res.status(201).json({
      message: 'Successfully registed a new user',
      registeredUser: {
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error: Email or Mobile Already Taken.',
    });
  }
});

export default handler;
