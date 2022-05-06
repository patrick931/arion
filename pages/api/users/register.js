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
    email: req.body.email,
    mobile: req.body.mobile,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  try {
    const user = await newUser.save();
    await dbConnect.disconnect();

    const token = signToken(user);
    res.status(201).json({
      message: 'Successfully registed a user',
      registeredUser: {
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
      message: 'Error registering the user',
    });
  }
});

export default handler;
