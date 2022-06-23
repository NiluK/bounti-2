import React from 'react';
import { Heading, Image, styled } from '@modulz/design-system';
import { Container, Text, Title, Divider, Grid, Paper, Button } from '@mantine/core';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import {
  User,
  withPageAuth,
  supabaseServerClient,
  getUser,
  supabaseClient,
} from '@supabase/auth-helpers-nextjs';
import NextLink from 'next/link';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Hr = styled('hr');

export default function Dashboard({ games }) {
  return (
    <main>
      <TitleAndMetaTags title="Dashboard" />
      <Container size={'lg'} my="lg">
        <Grid
          columns={2}
          sx={{
            placeItems: 'center',
          }}
        >
          <Grid.Col span={1}>
            <Title order={2}>Your Games</Title>
          </Grid.Col>
          <Grid.Col
            span={1}
            sx={{
              textAlign: 'right',
            }}
          >
            <NextLink href="/games/new" passHref>
              <Button>
                <FontAwesomeIcon icon={faPlus} />
                <Text mx={10}>Create Game</Text>
              </Button>
            </NextLink>
          </Grid.Col>
        </Grid>
        <Divider my="lg" />
        <Grid columns={3}>
          {games?.map(({ game }) => {
            return (
              <Grid.Col span={1}>
                <NextLink href={`/games/${game.slug}`} key={game.id} passHref>
                  <Paper p={10} withBorder shadow={'xs'}>
                    <Image
                      src={`https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${game.featured_image}`}
                      css={{
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                      }}
                    />

                    <Text size="lg" mt="lg">
                      {game.name}
                    </Text>
                  </Paper>
                </NextLink>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </main>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const supabase = supabaseServerClient(ctx);
    let user;
    try {
      user = await getUser(ctx);
    } catch (e) {
      console.error(e);
      user = null;
    }

    if (!user.user) {
      return {
        props: {
          redirect: {
            pathname: '/login',
          },
        },
      };
    }

    const { data } = await supabase
      .from('developer')
      .select('*, developer_game(game(*))')
      .eq('profile_owner', user.user.id)
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
