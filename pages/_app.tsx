import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { globalCss, darkTheme, DesignSystemProvider, Box } from '@modulz/design-system';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { PrimitivesPage } from '@components/PrimitivesPage';
import { DesignSystemPage } from '@components/DesignSystemPage';
import { ColorsPage } from '@components/ColorsPage';
import { useAnalytics } from '@lib/analytics';
import Head from 'next/head';
import supabase from '@lib/supabase';
import { UserContext } from '@lib/context';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  body: {
    margin: 0,
    color: '$hiContrast',
    backgroundColor: '$loContrast',
    fontFamily: '$untitled',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTextSizeAdjust: '100%',

    '.dark-theme &': {
      backgroundColor: '$mauve1',
    },
  },

  svg: {
    display: 'block',
    verticalAlign: 'middle',
    overflow: 'visible',
  },

  'pre, code': { margin: 0, fontFamily: '$mono' },

  '::selection': {
    backgroundColor: '$violetA5',
    color: '$violet12',
  },

  '#__next': {
    position: 'relative',
    zIndex: 0,
  },

  'h1, h2, h3, h4, h5': { fontWeight: 500 },
});

function App({ Component, pageProps }: AppProps) {
  globalStyles();
  useAnalytics();
  const router = useRouter();

  const supabaseUser = supabase.auth.user();

  const [user, setUser] = React.useState(supabaseUser);

  const isPrimitivesDocs = router.pathname.includes('/docs/primitives');
  const isDesignSystemDocs = router.pathname.includes('/docs/design-system');
  const isColorsDocs = router.pathname.includes('/docs/colors');
  const isDocsPage = isPrimitivesDocs || isDesignSystemDocs || isColorsDocs;

  React.useEffect(() => {
    supabase.auth.onAuthStateChange((action, data) => {
      if (action === 'SIGNED_IN') {
        setUser(data.user);
      }
      if (action === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, profile: null }}>
      <DesignSystemProvider>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          value={{ light: 'light-theme', dark: darkTheme.className }}
          defaultTheme="system"
        >
          <Header />

          {!isDocsPage && <Component {...pageProps} />}
          {isDocsPage && (
            <>
              <Box
                css={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  boxShadow: '0 0 0 1px $colors$mauve5',
                  zIndex: 2,
                  backgroundColor: '$loContrast',

                  '.dark-theme &': {
                    backgroundColor: '$mauve1',
                  },
                }}
              >
                <Box css={{ pt: '$8', position: 'relative', zIndex: 1 }}>
                  {isPrimitivesDocs && (
                    <PrimitivesPage>
                      <Component {...pageProps} />
                    </PrimitivesPage>
                  )}
                  {isDesignSystemDocs && (
                    <DesignSystemPage>
                      <Component {...pageProps} />
                    </DesignSystemPage>
                  )}
                  {isColorsDocs && (
                    <ColorsPage>
                      <Component {...pageProps} />
                    </ColorsPage>
                  )}
                </Box>
              </Box>
            </>
          )}
        </ThemeProvider>
      </DesignSystemProvider>
    </UserContext.Provider>
  );
}

export default App;
