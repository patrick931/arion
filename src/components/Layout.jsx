import Appbar from './Appbar';
import React from 'react';

// eslint-disable-next-line react/prop-types
export default function Layout({ children }) {
  return (
    <>
      <Appbar />
      <div>{children}</div>
    </>
  );
}
