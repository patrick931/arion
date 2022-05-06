import Appbar from './Appbar';
import React from 'react';
import { Box } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function Layout({ children }) {
  return (
    <>
      <Appbar />
      <Box>{children}</Box>
    </>
  );
}
