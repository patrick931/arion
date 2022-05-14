import React from 'react';
import Layout from '../src/components/Layout';
import { Box, Typography } from '@mui/material';

export default function ResetPassword() {
  return (
    <Layout title="Reset Password">
      <Box
        sx={{
          p: 1,
          mt: 9,
          // height: 10,
          background: 'silver',
        }}
      >
        <Typography>Reset Password</Typography>
      </Box>
    </Layout>
  );
}
