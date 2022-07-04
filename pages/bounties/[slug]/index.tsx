//@ts-nocheck
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { GameHero } from '@components/games/GameHero';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  TypographyStylesProvider,
  Text,
  Button,
  Badge,
} from '@mantine/core';
import Link from 'next/link';
import { faHourglass, faTrophy } from '@fortawesome/free-solid-svg-icons';
import formatDistance from 'date-fns/formatDistance';

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
      '*, bounti_developer(developer(*)), bounti_category(category(*)), bounti_platform(platform(*)), bounti_game(game(*))'
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
  const router = useRouter();
  const { slug } = router.query;

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

  const category = bounti.bounti_category;

  return (
    <>
      <TitleAndMetaTags title={`${bounti.title}`} image={bounti.featured_image} />
      <Container size={'lg'} my="lg">
        <Title order={2}>{bounti.title}</Title>
        {category?.map(({ category }) => (
          <Badge key={category.name} my={'lg'}>
            {category.name}
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

              <Grid columns={8} my="lg">
                <Grid.Col span={1}>
                  <Title order={5}>Category</Title>
                  {category?.map(({ category }) => (
                    <Badge my="sm" key={category.name}>
                      {category.name}
                    </Badge>
                  ))}
                </Grid.Col>
                <Grid.Col span={1}>
                  <Title order={5}>Rewards</Title>
                  <Text my="xs">
                    <Text component="span" ml="sm" color="yellow">
                      <FontAwesomeIcon icon={faTrophy} />
                    </Text>
                    <Text component="span" ml="sm">
                      {bounti.reward_number}
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Title order={5}>Deadline</Title>
                  <Text my="xs">
                    <Text component="span" ml="sm" color="teal">
                      <FontAwesomeIcon icon={faHourglass} />
                    </Text>
                    <Text component="span" ml="sm">
                      {formatDistance(new Date(bounti.reward_deadline), new Date(), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Title order={5}>Build</Title>
                  <Text my="xs">{bounti.build}</Text>
                </Grid.Col>
              </Grid>
              <Title order={5} my="sm">
                Reward Distributon
              </Title>

              <Text>{bounti.reward_distribution}</Text>
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
                <Text size={100} color="yellow">
                  {bounti.reward_value} AUD
                </Text>
              </Title>

              <Title align="center" order={4}>
                Submissions
              </Title>

              <Title my="sm" align="center" order={3}>
                25 / {bounti.max_submissions}
              </Title>
              <Link href={`/bounties/${slug}/submissions/new`}>
                <Button
                  fullWidth
                  my="lg"
                  type="submit"
                  size={'md'}
                  // loading={loading}
                >
                  Submit
                </Button>
              </Link>
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
      '*, bounti_developer(developer(*)), bounti_category(category(*)), bounti_platform(platform(*)), bounti_game(game(*)), bounti_submission(submission(*)))'
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
