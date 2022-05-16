import React, { useContext } from 'react';
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
  Select,
  MenuItem,
  Card,
  List,
  ListItem,
} from '@mui/material';
import { Store } from '../utils/Store';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

function CartScreen() {
  const router = useRouter();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry, Product is Out of Stock', { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    enqueueSnackbar(`${item.name} Quantity Updated`, { variant: 'success' });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    enqueueSnackbar(`${item.name} Removed from Cart`, { variant: 'warning' });
  };
  const checkOutHandler = () => {
    router.push('/shipping');
  };
  return (
    <Layout title="Shopping Cart">
      <Box
        textAlign="center"
        sx={{
          p: 1,
          mt: 9,
          background: 'silver',
        }}
      >
        <Typography>Shopping Cart</Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <NextLink href="/" passHref>
          <Link>
            <Button
              fullWidth
              sx={{
                // mt: 1,
                mb: 2,
                p: 3,
              }}
            >
              Go Back to Products
            </Button>
          </Link>
        </NextLink>
      </Box>

      {cartItems.length === 0 ? (
        <Grid item>
          <NextLink href="/" passHref>
            <Button
              fullWidth
              // variant="contained"
              component={Link}
              sx={{
                mt: 9,
                mb: 2,
                p: 3,
              }}
            >
              Cart is Empty. Go Shopping
            </Button>
          </NextLink>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.sellingPrice}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ${' '}
                    {cartItems.reduce(
                      (a, c) => a + c.quantity * c.sellingPrice,
                      0
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => checkOutHandler()}
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
