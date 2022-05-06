import Appbar from './Appbar';
import React from 'react';
import { Box } from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <Appbar />
      <Box>{children}</Box>
    </>
  );
}