import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { GetServerSidePropsContext } from 'next';
import { globalCss, darkTheme, DesignSystemProvider, Box } from '@modulz/design-system';
import { Header } from '@components/Header';
import { useAnalytics } from '@lib/analytics';
import NextNProgress from 'nextjs-progressbar';
import { ProfileProvider } from 'context/profile';
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  AppShell,
  Navbar,
  Footer,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';
import { getCookie, setCookies } from 'cookies-next';

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  useAnalytics();
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme || preferredColorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme, primaryColor: 'orange' }}
      >
        <NotificationsProvider>
          <UserProvider supabaseClient={supabaseClient}>
            <ProfileProvider>
              <AppShell
                header={<Header />}
                styles={(theme) => ({
                  main: {
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                  },
                })}
              >
                <NextNProgress color="#F76809" />
                <Component {...pageProps} />
              </AppShell>
            </ProfileProvider>
          </UserProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => {
  try {
    const colorScheme = getCookie('mantine-color-scheme', ctx) || 'dark';
    return { colorScheme };
  } catch (error) {
    return { colorScheme: 'dark' };
  }
};

export default App;
