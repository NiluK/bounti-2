import React from 'react';
import { styled } from '@modulz/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import ReactPlayer from 'react-player';
import Link from 'next/link';
import { Image, Container, Box, Button, Grid, Text } from '@mantine/core';
import GameCarousel from './GameCarousel';
const Rp = styled(ReactPlayer);

function isImage(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export const GameHero = ({ game }) => {
  const hasMedia = game.media?.length > 0;
  const [heroImage, setHeroImage] = React.useState(hasMedia ? game.media[0] : game.featured_image);

  return (
    <Grid
      columns={3}
      sx={{
        flexDirection: 'row-reverse',
      }}
    >
      <Grid.Col xs={3} sm={1}>
        <Box mr="sm">
          <Image src={game.featured_image} width="100%" alt={game.name} />
          <Text my="sm" size="sm">
            {game.summary}
          </Text>
          {game.website && (
            <Link href={game.website} passHref>
              <Button my="lg" fullWidth>
                View website
              </Button>
            </Link>
          )}
        </Box>
      </Grid.Col>
      <Grid.Col xs={3} sm={2}>
        {isImage(heroImage) ? (
          <Image ml="sm" src={heroImage} width="100%" alt={game.name} />
        ) : (
          <Rp url={heroImage} width="100%" />
        )}
        <Box
          mt="sm"
          ml="sm"
          sx={{
            position: 'relative',
          }}
        >
          {hasMedia && <GameCarousel setHeroImage={setHeroImage} game={game} />}
        </Box>
      </Grid.Col>
    </Grid>
  );
};
