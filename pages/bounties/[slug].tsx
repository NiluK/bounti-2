import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { GameHero } from '@components/games/GameHero';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
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
    .select('*, developer_bounti(developer(*)), type_bounti(type(*)), platform_bounti(platform(*))')
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

export default function CaseStudy(props) {
  const { theme } = useTheme();
  const { classes } = useStyles();

  const [bounti, setBounti] = useState(props.bounti);
  const [developer, setDeveloper] = useState(props.developer);

  const game = bounti;

  useEffect(() => {
    if (!bounti) {
      const bounti = fetchBounti();
      setBounti(bounti);
    }
    if (!developer) {
      const developer = fetchDeveloper(bounti.developer_bounti[0].developer.uuid);
      setDeveloper(developer);
    }
  }, [bounti, developer]);

  const genre = game?.genre_game;
  const feature = game?.genre_game;
  const platform = game?.genre_game;

  return (
    <>
      <TitleAndMetaTags
        title={`${game.name} – Case studies – Radix UI`}
        image={`https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${game.featured_image}`}
      />
      <Container size={'lg'} my="lg">
        <Title my={'lg'} order={2}>
          {bounti.title}
        </Title>
        {/* {genre?.map(({ genre }) => (
          <Badge key={genre.name} my={'sm'}>
            {genre.name}
          </Badge>
        ))} */}
        {/* <Paper my="lg" shadow="xs" radius="md" py="sm" withBorder>
              <GameHero game={game} />
            </Paper> */}
        <Grid columns={3}>
          <Grid.Col xs={3} sm={2}>
            <Paper my="lg" shadow="xs" radius="md" p="sm" withBorder>
              <TypographyStylesProvider>
                <div
                  dangerouslySetInnerHTML={{ __html: game?.instructions }}
                  className={classes.description}
                />
              </TypographyStylesProvider>
            </Paper>
          </Grid.Col>
          <Grid.Col xs={3} sm={1}>
            <Paper my="lg" shadow="xs" radius="md" p="sm" withBorder>
              <Text size={'lg'}>
                More from
                <Link href={`/developer/${developer?.name}`}>
                  <a className={classes.link}>{developer?.name}</a>
                </Link>
              </Text>
              <Text>{developer?.description}</Text>
              {developer.developer_game?.map(({ game }) => (
                <Box>
                  <NextLink href="/games/[slug]" as={`/games/${game?.slug}`}>
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
                        <Text size="sm">{game?.name}</Text>
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
    .select('*, developer_bounti(developer(*)), type_bounti(type(*)), platform_bounti(platform(*))')
    .eq('slug', ctx.params.slug)
    .single();

  const { data: developer = {} } = await supabaseServerClient(ctx)
    .from('developer')
    .select('*, developer_bounti(bounti(*))')
    .eq('uuid', bounti.developer_bounti[0].developer.uuid)
    .single();

  return {
    props: {
      developer,
      bounti,
    },
  };
}
