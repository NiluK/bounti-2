import React from 'react';
import { Box, Container, Grid, Heading, Text, Image, Button, styled } from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { User, withPageAuth, supabaseServerClient, getUser } from '@supabase/auth-helpers-nextjs';
import NextLink from 'next/link';
const Hr = styled('hr');

export default function Dashboard({ games }) {
  return (
    <Box>
      <TitleAndMetaTags title="Dashboard" />
      <Container size="3">
        <Grid
          columns={{ '@initial': 2, '@bp1': 2 }}
          css={{
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Heading
            size="2"
            as="h1"
            css={{
              my: '$2',
              display: 'inline-flex',
            }}
          >
            Your Games
          </Heading>
          <Box
            css={{
              display: 'inline-flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <NextLink href="/games/new" passHref>
              <Button
                css={{
                  backgroundColor: '$orange10',
                  color: 'white',
                }}
                size="2"
              >
                Create a Game
              </Button>
            </NextLink>
          </Box>
        </Grid>
        <Hr as="hr" css={{ borderColor: '$slate6', mb: '$4' }} />
        <Grid columns={{ '@initial': 1, '@bp1': 3 }} gap={3}>
          {games?.map(({ game }) => (
            <NextLink href={`/games/${game.slug}`} key={game.id} passHref>
              <Box
                css={{
                  background: '$gray3',
                }}
              >
                <Image
                  src={game.featuredImage}
                  css={{
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                  }}
                />

                <Text
                  as="h3"
                  size="5"
                  css={{
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.3,
                    color: '$slate12',
                    p: '$5',
                  }}
                >
                  {game.name}
                </Text>
              </Box>
            </NextLink>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const supabase = supabaseServerClient(ctx);
    const user = await getUser(ctx);

    const { data } = await supabase
      .from('developer')
      .select('*, developer_game(game(*))')
      .eq('owner', user.user.id)
      .single();

    const games = data.developer_game;
    return {
      props: {
        developer: data,
        games,
      },
    };
  },
});
