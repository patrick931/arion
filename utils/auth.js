import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,

    {
      expiresIn: '30d',
    }
  );
  // return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
        console.log(err);
        console.log(token);
      } else {
        req.user = decode;
        console.log(req.user);
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token Supplied' });
    // console.log(err);
  }
};

export { signToken, isAuth };
