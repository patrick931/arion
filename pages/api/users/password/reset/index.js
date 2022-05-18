// import nc from 'next-connect';
// import User from '../../../../../src/models/User';
// import dbConnect from '../../../../../utils/dbConnect';
// import bcrypt from 'bcryptjs';
// import { signToken } from '../../../../../utils/auth';

// const handler = nc();

// handler.post(async (req, res) => {
//     try {
//         await dbConnect.connect();
//   const user = await User.findOne({ email: req.body.email });
//   await dbConnect.disconnect();
//   if (!user)
//       throw new Error('This email is not associated with any account.');
//     }

//   if (user && bcrypt.compareSync(req.body.password, user.password)) {
//     const token = signToken(user);
//     res.send({
//       token,
//       _id: user._id,
//       firstName: user.firstName,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(401).send({ message: 'Invalid Email or Password' });
//   }
// });

// export default handler;
