import React, { useContext, useEffect } from 'react';
import { Heading, Image, styled } from '@modulz/design-system';
import { Container, Text, Title, Divider, Grid, Paper, Button } from '@mantine/core';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { withPageAuth, supabaseServerClient, getUser } from '@supabase/auth-helpers-nextjs';
import NextLink from 'next/link';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { truncate } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, getProfileType, getProfile } from 'store/profile/profileSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { useUser } from '@supabase/auth-helpers-react';

export default function Dashboard(props) {
  const { games, bounties } = props;
  const { user } = props || useUser();

  const dispatch = useDispatch();
  const profileType = useSelector(getProfileType);
  const profile = useSelector(getProfile);

  useEffect(() => {
    dispatch(fetchProfile({ user, profile: profileType }) as unknown as AnyAction);
  }, [profileType, dispatch]);

  // if (!profile.is_completed) {
  //   return (
  //     <Container>
  //       <TitleAndMetaTags
  //         title="Bounti"
  //         description="An open-source React component library for building high-quality, accessible design systems and web apps."
  //         image="default.png"
  //       />
  //       <Title>Welcome to Bounti</Title>
  //       <Text>Please complete your profile to continue</Text>

  //     </Container>
  //   );
  // }

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
                <Text mx={5}>Create Game</Text>
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
      <Container size={'lg'} my="lg">
        <Grid
          columns={2}
          sx={{
            placeItems: 'center',
          }}
        >
          <Grid.Col span={1}>
            <Title order={2}>Your Bounties</Title>
          </Grid.Col>
          <Grid.Col
            span={1}
            sx={{
              textAlign: 'right',
            }}
          >
            <NextLink href="/bounties/new" passHref>
              <Button>
                <FontAwesomeIcon icon={faPlus} />
                <Text mx={5}>Create Bounty</Text>
              </Button>
            </NextLink>
          </Grid.Col>
        </Grid>
        <Divider my="lg" />
        <Grid columns={3}>
          {bounties?.map(({ bounti }) => {
            return (
              <Grid.Col span={1}>
                <NextLink href={`/bounties/${bounti.slug}`} key={bounti.id} passHref>
                  <Paper p={10} withBorder shadow={'xs'}>
                    <Image
                      src={`${bounti.featured_image}`}
                      css={{
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                      }}
                    />

                    <Text size="lg" mt="lg">
                      {truncate(bounti.title, { length: 35 })}
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
      .select('*, developer_game(game(*)), bounti_developer(bounti(*))')
      .eq('user_uuid', user.user.id)
      .single();

    const games = data.developer_game;
    const bounties = data.bounti_developer;

    return {
      props: {
        user,
        developer: data,
        games,
        bounties,
      },
    };
  },
});
