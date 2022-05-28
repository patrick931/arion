import React, { useContext, useEffect, useReducer, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../../src/components/Layout';
import {
  Box,
  Grid,
  Typography,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  List,
  ListItem,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { Store } from '../../utils/Store';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
// import CheckoutWizard from '../../src/components/CheckoutWizard';
import { getError } from '../../utils/errors';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: '',
      };
    default:
      state;
  }
}

function Order({ params }) {
  const { id: orderId } = params;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    discountPrice,
    subTotalPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/signin');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay]);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('Order is Paid', { variant: 'success' });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }
  return (
    <Layout title={`Order ${orderId}`}>
      <Box
        textAlign="center"
        sx={{
          p: 1,
          mt: 9,
          background: 'silver',
        }}
      >
        <Typography>
          <strong>Order {orderId}</strong>
        </Typography>
      </Box>
      {/* <Box sx={{ mt: 1 }}>
        {' '}
        <CheckoutWizard activeStep={4} />
      </Box> */}
      <Box sx={{ justifyItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Box sx={{ align: 'center', justifyItems: 'center' }}>
            <LinearProgress />
          </Box>
        ) : error ? (
          <Typography>{error}</Typography>
        ) : (
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
                  <ListItem>
                    Status:{' '}
                    {isDelivered
                      ? `Delivered at ${deliveredAt}`
                      : `Not Delivered`}
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
                  <ListItem>
                    Status: {isPaid ? `Paid at ${paidAt}` : 'Not Paid'}
                  </ListItem>
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
                          {orderItems.map((item) => (
                            <TableRow key={item._id}>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
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
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
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
                                  ${item.sellingPrice * item.quantity}
                                </Typography>
                              </TableCell>

                              <TableCell align="right">
                                <Typography>
                                  {item.productDiscountRate}
                                </Typography>
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
                  {!isPaid && (
                    <ListItem>
                      {isPending ? (
                        // <CircularProgress />
                        <LinearProgress />
                      ) : (
                        <Box sx={{ width: '100%' }}>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </Box>
                      )}
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
