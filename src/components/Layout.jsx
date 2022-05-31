import React, { useContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import NextLink from 'next/link';
import Footer from './Footer';
import {
  Container,
  Grid,
  Link,
  Badge,
  Switch,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Store } from '../../utils/Store';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import Cookies from 'js-cookie';
import classes from '../../utils/classes';
import { AccountCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';

// eslint-disable-next-line react/prop-types
export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

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
      tertiary: {
        main: 'yellow',
      },
    },
  });
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    // Cookies.set('darkMode', JSON.stringify(newDarkMode ? 'ON' : 'OFF'));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
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
            <NextLink href="/" passHref>
              <Link
                sx={{
                  flexGrow: 1,
                  cursor: 'pointer',
                  '& a': {
                    color: 'white',
                    textDecoration: 'none',
                  },
                }}
              >
                <Typography sx={classes.brand}>Arion</Typography>
              </Link>
            </NextLink>

            <Box>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
            </Box>

            <NextLink href="/cart" passHref>
              <Link>
                {cart.cartItems.length > 0 ? (
                  <Badge
                    color="tertiary"
                    badgeContent={cart.cartItems.length}
                    sx={{ color: 'black' }}
                  >
                    <ShoppingCartCheckoutOutlinedIcon
                      sx={{
                        cursor: 'pointer',
                        justifyContent: 'center',
                        color: 'white',
                        '&:hover': {
                          color: '#90f542',
                        },
                      }}
                    />
                  </Badge>
                ) : (
                  <ShoppingCartCheckoutOutlinedIcon
                    sx={{
                      cursor: 'pointer',
                      justifyContent: 'center',
                      color: 'white',
                      '&:hover': {
                        color: '#90f542',
                      },
                    }}
                  />
                )}
              </Link>
            </NextLink>
            {userInfo ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                  color="inherit"
                >
                  <AccountCircle
                    sx={{
                      ml: 2,
                      cursor: 'pointer',
                      color: 'white',
                      '&:hover': {
                        color: '#90f542',
                      },
                    }}
                  />
                </IconButton>
                {/* {userInfo.firstName} */}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem
                    onClick={loginMenuCloseHandler}
                    sx={{
                      backgroundColor: '#90f542',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {userInfo.firstName}
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, '/order-history')}
                  >
                    Order History
                  </MenuItem>
                  <MenuItem onClick={logoutClickHandler}>Log Out</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/signin" passHref>
                <Link>
                  <Button component="div" color="inherit">
                    Sign in
                  </Button>
                </Link>
              </NextLink>
            )}
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Footer sx={{ mt: 5 }} />
      </ThemeProvider>
    </>
  );
}
