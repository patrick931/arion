import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';

import createEmotionCache from '../utils/createEmotionCache';
import { StoreProvider } from '../utils/Store';
import Layout from '../src/components/Layout';
import { SnackbarProvider } from 'notistack';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache({ key: 'css' });

export default function MyApp(props) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [showChild, setShowChild] = React.useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <StoreProvider>
            <Component {...pageProps} />
          </StoreProvider>
        </SnackbarProvider>
      </CacheProvider>
    );
  }

  MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
  };
}
