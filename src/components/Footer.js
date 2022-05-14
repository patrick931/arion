import { Grid, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import React from 'react';

export default function Footer(props) {
  return (
    <Grid sx={{ textAlign: 'center' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {'Copyright © '}
        <Link color="inherit" href="/">
          pnkamau.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Grid>
  );
}
