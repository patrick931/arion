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
import NextLink from 'next/link';
import Layout from '../src/components/Layout';

import Product from '../src/models/Product';
import dbConnect from '../utils/dbConnect';

export default function Products({ products }) {
  return (
    <Layout>
      <Box
        sx={{
          p: 1,
          mt: 9,
          // height: 10,
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
          // mt: 1,
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
                <Button size="small" color="primary">
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
