import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import Layout from '../src/components/Layout';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { Container, Grid, List, ListItem, Typography } from '@mui/material';
import CheckoutWizard from '../src/components/CheckoutWizard';

const theme = createTheme();

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push('/signin?redirect=/shipping');
    }
    setValue('fullName', shippingAddress.fullName);
    setValue('addressline1', shippingAddress.addressline1);
    setValue('addressline2', shippingAddress.addressline2);
    setValue('mobile', shippingAddress.mobile);
    setValue('postalAddress', shippingAddress.postalAddress);
    setValue('city', shippingAddress.city);
    setValue('county', shippingAddress.county);
    setValue('country', shippingAddress.country);
  }, []);

  const submitHandler = ({
    fullName,
    addressline1,
    addressline2,
    mobile,
    postalAddress,
    city,
    county,
    country,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        addressline1,
        addressline2,
        mobile,
        postalAddress,
        city,
        county,
        country,
      },
    });

    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        addressline1,
        addressline2,
        mobile,
        postalAddress,
        city,
        county,
        country,
      })
    );
    router.push('/payment');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout title="Shipping">
        <Container component="main">
          <Box
            textAlign="center"
            sx={{
              p: 1,
              mt: 9,
              background: 'silver',
            }}
          >
            <Typography>Shipping Address</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <CheckoutWizard activeStep={1} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(submitHandler)}
            noValidate
          >
            <Grid container spacing={1}>
              <Grid item md={6} xs={12}>
                <List>
                  <ListItem>
                    <Controller
                      name="fullName"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="fullName"
                          label="Full Name"
                          name="fullName"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.fullName)}
                          helperText={
                            errors.fullName
                              ? errors.fullName.type === 'minLength'
                                ? 'Full Name length should be more that 2'
                                : 'Full Name is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="addressline1"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="addressline1"
                          label="Address Line 1"
                          name="addressline1"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.addressline1)}
                          helperText={
                            errors.addressline1
                              ? errors.addressline1.type === 'minLength'
                                ? 'Address line should be more that 2'
                                : 'Address line is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="addressline2"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="addressline2"
                          label="Address Line 2"
                          name="addressline2"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.addressline2)}
                          helperText={
                            errors.addressline2
                              ? errors.addressline2.type === 'minLength'
                                ? 'Address line should be more that 2'
                                : 'Address line is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="mobile"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="mobile"
                          label="Mobile"
                          name="mobile"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.mobile)}
                          helperText={
                            errors.mobile
                              ? errors.mobile.type === 'minLength'
                                ? 'Mobile length should be more that 9'
                                : 'Mobile is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={6} xs={12}>
                <List>
                  <ListItem>
                    <Controller
                      name="postalAddress"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="postalAddress"
                          label="Postal Address and Code"
                          name="postalAddress"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.postalAddress)}
                          helperText={
                            errors.postalAddress
                              ? errors.postalAddress.type === 'minLength'
                                ? 'Postal Address should be more that 2'
                                : 'Postal Address is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="city"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="city"
                          label="City / Town / Neighbourhood"
                          name="city"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.city)}
                          helperText={
                            errors.city
                              ? errors.city.type === 'minLength'
                                ? 'City should be more that 2'
                                : 'City is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="county"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="county"
                          label="County"
                          name="county"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.county)}
                          helperText={
                            errors.county
                              ? errors.county.type === 'minLength'
                                ? 'County should be more that 2'
                                : 'County is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="country"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="country"
                          label="Country"
                          name="country"
                          autoComplete="off"
                          autoFocus
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.country)}
                          helperText={
                            errors.country
                              ? errors.country.type === 'minLength'
                                ? 'Country should be more that 2'
                                : 'Country is Required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                </List>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
              >
                Continue
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => router.push('/cart')}
              >
                Back
              </Button>
            </Grid>
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
