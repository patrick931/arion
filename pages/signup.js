import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import axios from 'axios';
import Layout from '../src/components/Layout';
import { useRouter } from 'next/router';
import { getError } from '../utils/errors';
import { Controller, useForm } from 'react-hook-form';

const theme = createTheme();

export default function SignUp() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
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
      const { data } = await axios.post('/api/users/register', {
        firstName,
        lastName,
        email,
        mobile,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      router.push(redirect || '/');
      enqueueSnackbar('Successfully Signed Up', { variant: 'success' });
      return;
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout title="Sign up">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
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
                  pattern: /^[\w.-]{1,64}@(?!.{254})[\w.-]+\.[A-Za-z]{2,4}$/,
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
                  required: true,
                  minLength: 6,
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
                        ? errors.password.type === 'minLength'
                          ? 'Password Length Should be more than 5'
                          : 'Password is Required'
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
                  required: true,
                  minLength: 6,
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
                      errors.confirmPassword
                        ? errors.confirmPassword.type === 'minLength'
                          ? 'Confirm Password Length Should be more than 5'
                          : 'Confirm Password is Required'
                        : ''
                    }
                    {...field}
                  />
                )}
              ></Controller>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
              >
                Sign up
              </Button>
              <Grid container sx={{ color: '#0362fc' }}>
                <Grid item xs>
                  <Link href="/reset-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <NextLink
                    href={`/signin?redirect=${redirect || '/'}`}
                    passHref
                  >
                    <Link variant="body2">Sign in</Link>
                  </NextLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
