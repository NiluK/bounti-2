import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { getCssText } from '@modulz/design-system';
import { renderSnippet, gtagUrl } from '@lib/analytics';

import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

export default class Document extends NextDocument {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Krona+One&family=Sofia&display=swap"
            rel="stylesheet"
          />
          <meta name="title" content="Bounti" />
          <meta
            name="description"
            content="Get paid to play and promote video games. Bounti rewards you with crypto for completing bounties and promoting your favorite games."
          />
          <meta name="keywords" content="Bounti" />
          <meta name="robots" content="index, follow" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Bounti" />
          <meta property="og:url" content="https://www.bounti.xyz" />
          <meta
            property="og:description"
            content="Get paid to play and promote video games. Bounti rewards you with crypto for completing bounties and promoting your favorite games."
          />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#111827" />
          <meta name="msapplication-TileColor" content="#111827" />
          <meta name="theme-color" content="#111827" />
          <script src="https://kit.fontawesome.com/03d9d570da.js" crossOrigin="anonymous"></script>
          {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          /> */}
          <script async src={gtagUrl} />
          <script dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3027196,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
