import React from 'react';
import Layout from '../src/components/Layout';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';

const theme = createTheme();

export default function ResetPassword() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email }) => {
    closeSnackbar();

    try {
      const { data } = await axios.post('/api/users/password', {
        email,
      });
      // dispatch({ type: 'USER_PASSWORD_RESET', payload: data });

      enqueueSnackbar('Submitted', { variant: 'success' });
      return;
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Layout title="Reset Password">
        <Container
          component="main"
          // maxWidth="xs"
        >
          <CssBaseline />
          <Box
            textAlign="center"
            sx={{
              p: 1,
              mt: 9,
              // height: 10,
              background: 'silver',
            }}
          >
            <Typography>Reset Password</Typography>
          </Box>
          <h1>Forgot your password? Don't worry</h1>
          <p>
            Enter the email address associated with your account, and we will
            send you a link to reset your password.
          </p>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#0362fc' }}
            >
              Submit
            </Button>
          </Box>
          <Grid item xs sx={{ textAlign: 'center' }}>
            <Link href="/signin" variant="body2">
              Return to Sign in
            </Link>
          </Grid>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
