import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import NextLink from 'next/link';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { BoxLink } from '@components/BoxLink';
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { GameHero } from '@components/games/GameHero';
import { useTheme } from 'next-themes';
import { supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

import {
  Paper,
  Grid,
  Container,
  createStyles,
  Title,
  TypographyStylesProvider,
  Text,
  Tabs,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  description: {
    textDecoration: 'none',

    img: {
      width: '100%',
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  userMenu: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export default function CaseStudy({ game = {} }) {
  const { theme } = useTheme();
  const { classes } = useStyles();

  console.log('theme', theme);

  const developer = game?.developer_game?.[0]?.developer || {};

  console.log('developer', developer);

  return (
    <>
      <TitleAndMetaTags
        title={`${game.name} – Case studies – Radix UI`}
        // description={game.summary}
        image={`https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${game.featured_image}`}
      />
      <Container size={'lg'} my="lg">
        <Title my={'lg'} order={2}>
          {game.name}
        </Title>
        <Tabs variant="outline" grow>
          <Tabs.Tab label="Overview">
            <Grid columns={3} gutter="lg">
              <Grid.Col xs={3} sm={2}>
                <Paper my="lg" shadow="xs" radius="md" p="sm" withBorder>
                  <GameHero game={game} />
                </Paper>
                <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: game.description }}
                    className={classes.description}
                  />
                </TypographyStylesProvider>
              </Grid.Col>
              <Grid.Col xs={1}>
                <Paper my="lg" shadow="xs" radius="md" p="sm" withBorder>
                  {developer.name && (
                    <>
                      <Title>Developer</Title>
                      <Text>{developer.name}</Text>
                    </>
                  )}
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Tab>
          <Tabs.Tab label="Bounties">
            <Link href={`/games/${game.slug}/screenshots`}>
              <a>Screenshots</a>
            </Link>
          </Tabs.Tab>
        </Tabs>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { data: game = {} } = await supabaseServerClient(ctx)
    .from('game')
    .select('*, developer_game(developer(*))')
    .eq('slug', ctx.params.slug)
    .single();

  return {
    props: {
      game,
    },
  };
}
