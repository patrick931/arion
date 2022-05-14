import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import { Grid, Switch } from '@mui/material';
import jsCookie from 'js-cookie';

export default function ButtonAppBar() {
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  return (
    <Grid item xs={12} sm={8} md={5}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#0362fc' }}>
          <Toolbar>
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

            <Box display="flex" alignItems="center">
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
            </Box>

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
              Sign in
            </Button>
            {/* <Button href="users/signup" color="inherit">
              Sign up
            </Button> */}
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}
