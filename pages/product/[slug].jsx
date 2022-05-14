import React, { useContext } from 'react';
import Image from 'next/image';
import Layout from '../../src/components/Layout';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';

// import data from '../../utils/data';
import Product from '../../src/models/Product';
import dbConnect from '../../utils/dbConnect';
import classes from '../../utils/classes';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const { product } = props;

  if (!product) {
    return (
      <Grid item>
        <Button
          fullWidth
          component={Link}
          noLinkStyle
          href="/"
          sx={{
            mt: 9,
            mb: 2,
            p: 3,
          }}
        >
          Product not found. Go Back to Products List
        </Button>
      </Grid>
    );
  }

  const addToCartHandler = async () => {
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
    <Layout title={product.name} description={product.description}>
      <Box sx={{ mt: 5 }}>
        <NextLink href="/" passHref>
          <Link>
            <Button fullWidth sx={{ mt: 3, mb: 2, p: 3 }}>
              Go Back to Products
            </Button>
          </Link>
        </NextLink>
      </Box>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item md={6} xs={12}>
          <Card>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={200}
              layout="responsive"
            ></Image>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography
                component="h1"
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: '400',
                }}
              >
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.productCategory}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Type: {product.productType}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Typography sx={classes.smallText}>
                ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.sellingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: '#0362fc' }}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await dbConnect.connect();
  const product = await Product.findOne({ slug }).lean();

  await dbConnect.disconnect();

  return {
    props: {
      product: dbConnect.convertDocToObj(product),
    },
  };
}
