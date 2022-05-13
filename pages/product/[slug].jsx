import React from 'react';
import Image from 'next/image';
import Layout from '../../src/components/Layout';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
// import data from '../../utils/data';
import Product from '../../src/models/Product';
import dbConnect from '../../utils/dbConnect';
import classes from '../../utils/classes';

export default function ProductScreen(props) {
  const { product } = props;

  if (!product) {
    // return <div>Product Not Found</div>;
    return (
      <Grid item>
        <Button
          fullWidth
          // variant="contained"
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
  return (
    <Layout title={product.name} description={product.description}>
      <Box sx={{ mt: 5 }}>
        <Button
          fullWidth
          // variant="contained"
          href="/"
          sx={{ mt: 3, mb: 2, p: 3 }}
        >
          Go Back to Products
        </Button>
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
                  // margin: '1rem 0',
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
