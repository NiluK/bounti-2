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
import { truncate } from 'lodash';

export default function Dashboard({ games }) {
  return (
    <main>
      <TitleAndMetaTags title="Dashboard" />
      <Container size={'lg'} my="lg">
        <Title order={2}>All Games</Title>
        <Divider my="lg" />
        <Grid columns={3}>
          {games?.map((game) => {
            return (
              <Grid.Col span={1}>
                <NextLink href={`/games/${game.slug}`} key={game.id} passHref>
                  <Paper p={10} withBorder shadow={'xs'}>
                    <Image
                      src={`${game.featured_image}`}
                      css={{
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                      }}
                    />

                    <Text size="lg" mt="lg">
                      {truncate(game.name, { length: 35 })}
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

export async function getServerSideProps(ctx) {
  const supabase = supabaseServerClient(ctx);

  const { data } = await supabase.from('game').select('*');

  const games = data;
  return {
    props: {
      games,
    },
  };
}
