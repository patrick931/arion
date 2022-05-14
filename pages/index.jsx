import {
  Box,
  Card,
  Grid,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Link,
} from '@mui/material';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../src/components/Layout';
import { useSnackbar } from 'notistack';
import Product from '../src/models/Product';
import dbConnect from '../utils/dbConnect';
import { Store } from '../utils/Store';

export default function Products({ products }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry, Product is Out of Stock', { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
    enqueueSnackbar(`${product.name} added to cart`, { variant: 'success' });
  };
  return (
    <Layout>
      <Box
        textAlign="center"
        sx={{
          p: 1,
          mt: 9,
          background: 'silver',
        }}
      >
        <Typography>Products</Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          p: 3,
          minHeight: '80vh',
        }}
      >
        {products.map((product) => (
          <Grid
            item
            md={3}
            key={product._id}
            sx={{
              flexGrow: 1,
            }}
          >
            <Card>
              <NextLink href={`product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="170"
                      image={product.imageUrl}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                      <Rating value={product.rating} readOnly></Rating>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </NextLink>
              <CardActions>
                <Typography>${product.sellingPrice}</Typography>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => addToCartHandler(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
export async function getServerSideProps() {
  await dbConnect.connect();
  const products = await Product.find({}).lean();

  await dbConnect.disconnect();

  return {
    props: {
      products: products.map(dbConnect.convertDocToObj),
    },
  };
}
