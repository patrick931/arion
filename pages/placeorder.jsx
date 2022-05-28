import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../src/components/Layout';
import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@mui/material';
import { Store } from '../utils/Store';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import CheckoutWizard from '../src/components/CheckoutWizard';
import { getError } from '../utils/errors';
import Cookies from 'js-cookie';
import axios from 'axios';

function PlaceOrder() {
  const router = useRouter();
  const {
    state: {
      userInfo,
      cart: {
        cartItems,
        shippingAddress,
        paymentMethod,
        taxRate,
        productDiscountRate,
      },
    },
    dispatch,
  } = useContext(Store);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.sellingPrice * c.quantity, 0)
  );

  const discountPrice = round2(
    cartItems.reduce(
      (a, c) => a + c.productDiscountRate * c.sellingPrice * c.quantity,
      0
    )
  );

  const subTotalPrice = round2(itemsPrice - discountPrice);

  const shippingPrice = itemsPrice > 1000 ? 0 : 15;

  const taxPrice = round2(
    cartItems.reduce(
      (a, c) =>
        a +
        c.taxRate *
          (c.sellingPrice - c.productDiscountRate * c.sellingPrice) *
          c.quantity,
      0
    )
  );

  const totalPrice = round2(
    itemsPrice - discountPrice + (shippingPrice + taxPrice)
  );

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          discountPrice,
          subTotalPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Place Order">
      <Box
        textAlign="center"
        sx={{
          p: 1,
          mt: 9,
          background: 'silver',
        }}
      >
        <Typography>Place Order</Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        {' '}
        <CheckoutWizard activeStep={3} />
      </Box>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={{ mt: 1 }}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.addressline1},{' '}
                {shippingAddress.addressline2}, {shippingAddress.mobile},{' '}
                {shippingAddress.postalAddress}, {shippingAddress.city},{' '}
                {shippingAddress.county}, {shippingAddress.country}
              </ListItem>
            </List>
          </Card>
          <Card sx={{ mt: 1 }}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card sx={{ mt: 1 }}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Discount Rate</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Tax Rate</TableCell>
                        <TableCell align="right">Tax</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              ${round2(item.sellingPrice * item.quantity)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.productDiscountRate}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              ${' '}
                              {round2(
                                item.productDiscountRate *
                                  item.sellingPrice *
                                  item.quantity
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.taxRate}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              ${' '}
                              {round2(
                                (item.sellingPrice * item.quantity -
                                  item.productDiscountRate *
                                    item.sellingPrice *
                                    item.quantity) *
                                  item.taxRate
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card
            sx={{ mt: 1, justifyItems: 'center', justifyContent: 'center' }}
          >
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {discountPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Sub Total:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {subTotalPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>$ {totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem
                  sx={{ justifyItems: 'center', justifyContent: 'center' }}
                >
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
