//@ts-nocheck
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { GameHero } from '@components/games/GameHero';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import HorizontalCard from 'components/HorizontalCard';
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import {
  Paper,
  Grid,
  Container,
  createStyles,
  Title,
  Box,
  TypographyStylesProvider,
  Text,
  Space,
  Avatar,
  Button,
  Badge,
  Image,
  Tabs,
} from '@mantine/core';
import Link from 'next/link';

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

  link: {
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[8],
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '5px',
  },

  linkActive: {
    textDecoration: 'none',
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

const fetchBounti = async () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: bounti = {} } = await supabaseClient
    .from('bounti')
    .select(
      '*, bounti_developer(developer(*)), bounti_type(type(*)), bounti_platform(platform(*)), bounti_game(game(*))'
    )
    .eq('slug', slug)
    .single();
  return bounti;
};

const fetchDeveloper = async (developerId) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: developer = {} } = await supabaseClient
    .from('developer')
    .select('*, developer_game(game(*))')
    .eq('uuid', developerId)
    .single();
  return developer;
};

export default function Bounti(props) {
  const { theme } = useTheme();
  const { classes } = useStyles();

  const [bounti, setBounti] = useState(props.bounti);
  const [developer, setDeveloper] = useState(props.developer);

  const game = bounti.bounti_game[0].game;

  useEffect(() => {
    if (!bounti) {
      const bounti = fetchBounti();
      setBounti(bounti);
    }
    if (!developer) {
      const developer = fetchDeveloper(bounti.bounti_developer[0].developer.uuid);
      setDeveloper(developer);
    }
  }, [bounti, developer]);

  const type = bounti.bounti_type;

  return (
    <>
      <TitleAndMetaTags title={`${bounti.title}`} image={bounti.featured_image} />
      <Container size={'lg'} my="lg">
        <Title order={2}>{bounti.title}</Title>
        {type?.map(({ type }) => (
          <Badge key={type.name} my={'lg'}>
            {type.name}
          </Badge>
        ))}
        <Grid columns={3}>
          <Grid.Col xs={3} sm={2}>
            <HorizontalCard game={game} />
            <Title order={3} my="md">
              Summary
            </Title>
            <Paper p="sm">
              <Text>{bounti.subtitle}</Text>
            </Paper>
            <Title order={3} my="md">
              Instructions
            </Title>
            <Paper shadow="xs" radius="md" p="sm" withBorder>
              <TypographyStylesProvider>
                <div
                  dangerouslySetInnerHTML={{ __html: bounti?.instructions }}
                  className={classes.description}
                />
              </TypographyStylesProvider>
            </Paper>
            <Title order={3} my="md">
              Entries {bounti.submissions_count}
            </Title>
          </Grid.Col>
          <Grid.Col
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
            xs={3}
            sm={1}
          >
            <Paper shadow="xs" radius="md" p="sm" withBorder>
              <Title align="center" order={3}>
                Reward Pool
              </Title>

              <Title my="xl" align="center" order={1}>
                {bounti.reward_value} AUD
              </Title>
              <Text>{bounti.reward_distribution}</Text>
              <Button
                fullWidth
                my="lg"
                type="submit"
                size={'md'}
                // loading={loading}
              >
                Join Bounti
              </Button>
              <Text>{developer?.description}</Text>
              {developer.developer_game?.map(({ game }) => (
                <Box>
                  <NextLink href="/games/[slug]" as={`/bounties/${bounti?.slug}`}>
                    <a className={classes.linkActive}>
                      <Paper my="lg" shadow="xs" radius="md" p="sm" withBorder>
                        <Image
                          fit="contain"
                          sx={(theme) => ({
                            objectFit: 'cover',
                            [theme.fn.smallerThan('sm')]: {
                              width: '200px',
                            },
                            width: '300px',
                            objectPosition: 'top center',
                            height: '100%',
                            aspectRatio: '16 / 9',
                            p: 'sm',
                            borderRadius: '5px',
                            paddingBottom: '2px',
                          })}
                          src={game?.featured_image}
                        />
                        <Text size="sm">{bounti?.name}</Text>
                      </Paper>
                    </a>
                  </NextLink>
                </Box>
              ))}
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { data: bounti = {} } = await supabaseServerClient(ctx)
    .from('bounti')
    .select(
      '*, bounti_developer(developer(*)), bounti_type(type(*)), bounti_platform(platform(*)), bounti_game(game(*)), bounti_submission(submission(*)))'
    )
    .eq('slug', ctx.params.slug)
    .single();

  const { data: developer = {} } = await supabaseServerClient(ctx)
    .from('developer')
    .select('*, bounti_developer(bounti(*))')
    .eq('uuid', bounti.bounti_developer[0].developer.uuid)
    .single();

  return {
    props: {
      developer,
      bounti,
    },
  };
}
