// import Appbar from './Appbar';
import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import NextLink from 'next/link';
import Footer from './Footer';
import { Container, Grid, Link } from '@mui/material';
import { Store } from '../../utils/Store';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Switch } from '@mui/material';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import classes from '../../utils/classes';

// eslint-disable-next-line react/prop-types
export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5a03fc',
      },
      secondary: {
        main: '#5a03fc',
      },
    },
  });
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    // Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    Cookies.set('darkMode', JSON.stringify(newDarkMode ? 'ON' : 'OFF'));
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Arion` : 'Arion'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                backgroundColor: '#5a03fc',
                mr: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              fontWeight="bold"
              color="white"
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                cursor: 'pointer',
                '& a': {
                  color: 'white',
                  textDecoration: 'none',
                },
              }}
            >
              <a href="/">Arion</a>
            </Typography>
            {/* <Box display="flex" alignItems="center">
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>Arion</Typography>
                </Link>
              </NextLink>
            </Box> */}
            {/* <Box>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
            </Box> */}
            <Box
              sx={{
                cursor: 'pointer',
                color: 'inherit',
              }}
            >
              <ShoppingCartCheckoutOutlinedIcon
                onClick={(event) => (window.location.href = '/cart')}
                sx={{
                  mr: 3,
                  color: 'white',
                  '&:hover': {
                    color: 'red',
                  },
                }}
              />
            </Box>
            <Button href="/signin" color="inherit">
              Sign in{' '}
            </Button>{' '}
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
}
