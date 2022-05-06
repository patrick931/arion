import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import { Grid } from '@mui/material';
import Link from '@mui/material/Link';

export default function ButtonAppBar() {
  return (
    <Grid item xs={12} sm={8} md={5}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              to="/"
              color="white"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
            >
              <a href="/" underline="none">
                Arion
              </a>
            </Typography>

            <Box sx={{ cursor: 'pointer' }}>
              <ShoppingCartCheckoutOutlinedIcon />
            </Box>

            <Button href="users/signin" color="inherit">
              Login
            </Button>
            <Button href="users/signup" color="inherit">
              Register
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}
