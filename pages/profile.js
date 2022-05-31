import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import axios from 'axios';
import { getError } from '../utils/errors';
import Layout from '../src/components/Layout';
import { useSnackbar } from 'notistack';
import NextLink from 'next/link';

import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

function Profile() {
  const { state, dispatch } = useContext(Store);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/signin');
    }
    setValue('firstName', userInfo.firstName);
    setValue('lastName', userInfo.lastName);
    setValue('mobile', userInfo.mobile);
    setValue('email', userInfo.email);
  }, []);
  const submitHandler = async ({
    firstName,
    lastName,
    mobile,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          firstName,
          lastName,
          mobile,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      enqueueSnackbar('Profile Updated Successfully', { variant: 'success' });
      return;
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
      console.log(err);
    }
  };
  return (
    <Layout title="Order History">
      <Box
        textAlign="center"
        sx={{
          p: 1,
          mt: 9,
          background: 'silver',
        }}
      >
        <Typography>Profile</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ mt: 1 }}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card sx={{ mt: 1 }}>
            <List>
              <ListItem>
                <Box
                  component="form"
                  onSubmit={handleSubmit(submitHandler)}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Controller
                    name="firstName"
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
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ type: 'text' }}
                        error={Boolean(errors.firstName)}
                        helperText={
                          errors.firstName
                            ? errors.firstName.type === 'minLength'
                              ? 'First Name length should be more that 2'
                              : 'First Name is Required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="lastName"
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
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ type: 'text' }}
                        error={Boolean(errors.lastName)}
                        helperText={
                          errors.lastName
                            ? errors.lastName.type === 'minLength'
                              ? 'Last Name length should be 2'
                              : 'Last Name is Required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      pattern:
                        /^[\w.-]{1,64}@(?!.{254})[\w.-]+\.[A-Za-z]{2,4}$/,
                    }}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ type: 'email' }}
                        error={Boolean(errors.email)}
                        helperText={
                          errors.email
                            ? errors.email.type === 'pattern'
                              ? 'Invalid Email'
                              : 'Email is Required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="mobile"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 10,
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
                              ? 'Mobile length should be more than 9'
                              : 'Mobile is Required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Password lenth is more than 5',
                    }}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ type: 'password' }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? 'Password Length Should be more than 5'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Confirm Password lenth is more than 5',
                    }}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ type: 'password' }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? 'Confirm Password Length Should be more than 5'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
                  >
                    Update
                  </Button>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
