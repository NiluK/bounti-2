import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type TitleAndMetaTagsProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  pathname?: string;
};

export function TitleAndMetaTags({
  title = 'Bounti',
  description = 'Get paid to play and promote video games. Bounti rewards you with crypto for completing bounties and promoting your favorite games',
  image,
  url = 'https://bounti.xyz',
  pathname,
}: TitleAndMetaTagsProps) {
  const router = useRouter();

  const imageUrl = 'https://bounti-images.s3.us-east-1.amazonaws.com/bounti-opengraph.png';
  const path = pathname || router.pathname;

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:url" content={`${url}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:site" content="@bountixyz" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
