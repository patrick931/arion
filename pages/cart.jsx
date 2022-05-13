import React from 'react';
import Layout from '../src/components/Layout';
import { Box, Typography } from '@mui/material';

export default function Cart() {
  return (
    <Layout title="Cart">
      <Box
        sx={{
          p: 1,
          mt: 9,
          // height: 10,
          background: 'silver',
        }}
      >
        <Typography>Cart</Typography>
      </Box>
    </Layout>
  );
}
