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
import { Grid, Typography } from '@mui/material';

const theme = createTheme();

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push('/signin?redirect=/shipping');
    }
  }, []);

  const submitHandler = ({
    fullName,
    addressline1,
    addressLine2,
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
        addressLine2,
        mobile,
        postalAddress,
        city,
        county,
        country,
      },
    });
    Cookies.set('shippingAddress', {
      fullName,
      addressline1,
      addressLine2,
      mobile,
      postalAddress,
      city,
      county,
      country,
    });
    router.push('/payment');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout title="Shipping">
        <Box
          component="form"
          textAlign="center"
          sx={{
            p: 1,
            mt: 9,
            background: 'silver',
          }}
        >
          <Typography>Shipping Address</Typography>
        </Box>
        {/* <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Box
              component="form"
              onSubmit={handleSubmit(submitHandler)}
              noValidate
              // sx={{ mt: 1 }}
            >
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
                    required="true"
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
              <Grid item md={6} xs={12}></Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
              >
                Continue
              </Button>
            </Box>
          </Grid>
        </Grid> */}
      </Layout>
    </ThemeProvider>
  );
}
