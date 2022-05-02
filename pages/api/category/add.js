import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import Category from '../../../models/Category';
import dbConnect from '../../../utils/dbConnect';

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  await dbConnect.connect();
  const newCategory = new Category({
    code: req.body.code,
    categoryName: req.body.categoryName,
    description: req.body.description,
  });
  try {
    const category = await newCategory.save();
    await dbConnect.disconnect();
    res.status(201).json({
      message: 'Successfully created a category',
      newCategory: {
        code: category.code,
        categoryName: category.categoryName,
        description: category.description,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating a category',
    });
  }
});

export default handler;
