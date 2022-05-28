import * as React from 'react';
import Cookies from 'js-cookie';
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
import NextLink from 'next/link';
import axios from 'axios';
import Layout from '../src/components/Layout';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';

const theme = createTheme();

export default function SignIn() {
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
      router.push(redirect || '/');
    }
  }, [router, userInfo, redirect]);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();

    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      // Cookies.set('userInfo', data);
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
      enqueueSnackbar('Successful Login', { variant: 'success' });
      return;
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' }
      );

      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout title="Sign In">
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
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(submitHandler)}
              noValidate
              sx={{ mt: 1 }}
            >
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
                    variant="outlined"
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
                Sign In
              </Button>
              <Grid container sx={{ color: '#0362fc' }}>
                <Grid item xs>
                  <Link href="/reset-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <NextLink
                    href={`/signup?redirect=${redirect || '/'}`}
                    passHref
                  >
                    <Link variant="body2">Sign up</Link>
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
