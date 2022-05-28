import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckoutWizard from '../src/components/CheckoutWizard';
import Layout from '../src/components/Layout';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const theme = createTheme();

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!shippingAddress.addressline1) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);
  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment Method is Required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout title="Payment Method">
        <Box
          textAlign="center"
          sx={{
            p: 1,
            mt: 9,
            background: 'silver',
          }}
        >
          <Typography>Payment Method</Typography>
        </Box>
        <Container component="main">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <CheckoutWizard activeStep={2} />
                <form onSubmit={submitHandler}>
                  <List>
                    <ListItem>
                      <FormControl component={'fieldset'}>
                        <RadioGroup
                          aria-label="Payment Method"
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <FormControlLabel
                            label="PayPal"
                            value="PayPal"
                            control={<Radio />}
                          ></FormControlLabel>
                          <FormControlLabel
                            label="Stripe"
                            value="Stripe"
                            control={<Radio />}
                          ></FormControlLabel>
                          <FormControlLabel
                            label="Cash"
                            value="Cash"
                            control={<Radio />}
                          ></FormControlLabel>
                        </RadioGroup>
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
                      >
                        Continue
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => router.push('/shipping')}
                      >
                        Back
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
