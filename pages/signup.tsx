import { useEffect, useState } from 'react';
import { Box, TextField, Image } from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MDXProvider, components } from '@components/MDXComponents';
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx';
import { Header } from '@components/Header';
import { MarketingCaption } from '@components/marketing/MarketingCaption';
import { CaseStudyLogo, CaseStudyLogoVariant } from '@components/marketing/CaseStudyLogo';
import { Footer } from '@components/Footer';
import { BoxLink } from '@components/BoxLink';
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { BenefitsSection } from '@components/marketing/BenefitsSection';
import { GameHero } from '@components/games/GameHero';
import supabase from '@lib/supabase';
import NextLink from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { styled } from '@modulz/design-system';
import {
  faPlay,
  faGamepad,
  faComment,
  faUserAstronaut,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitch,
  faGithub,
  faDiscord,
  faTwitter,
  faFacebook,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { getUser } from '@supabase/auth-helpers-nextjs';
import { Container, Paper, Grid, Text, Title, TextInput, Button, Divider } from '@mantine/core';
async function signInWithProvider(provider, setLoading) {
  setLoading(true);
  const { user, session, error } = await supabaseClient.auth.signIn(
    {
      provider,
    },
    {
      redirectTo: `${window.location.origin}/signup`,
    }
  );
  setLoading(false);
}

async function signInWithEmail(email, setLoading) {
  setLoading(true);
  const { user, error } = await supabaseClient.auth.signIn(
    {
      email,
    },
    {
      redirectTo: `${window.location.origin}/signup`,
    }
  );
  setLoading(false);
}

const FAIcon = styled(FontAwesomeIcon);

const SignUp = ({ game = {} }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);
  return (
    <Container size={'lg'}>
      <Paper m="lg" shadow="xs" radius="md" p="xl" withBorder>
        <Grid
          columns={2}
          sx={{
            placeItems: 'center',
          }}
        >
          <Grid.Col xs={2} md={1}>
            <Title
              order={3}
              m="xl"
              sx={{
                textAlign: 'center',
              }}
            >
              Sign up to
              <Text
                size={'xl'}
                mx={'xs'}
                sx={(theme) => ({
                  fontFamily: 'Krona One',
                  display: 'inline',
                  color: theme.colors.orange[8],
                })}
              >
                Bounti
              </Text>
            </Title>
            <TextInput
              type="text"
              className="input"
              placeholder="Your Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Button
              my={'sm'}
              fullWidth
              loading={loading}
              sx={(theme) => ({
                backgroundColor: theme.colors.orange[8],
                color: theme.colors.white,
                borderColor: theme.colors.orange[8],
                '&:hover': {
                  backgroundColor: theme.colors.orange[9],
                  borderColor: theme.colors.orange[9],
                },
              })}
              onClick={() => {
                signInWithEmail(email, setLoading);
              }}
            >
              Login
            </Button>
            <Divider my={'xl'} label="OR" labelPosition="center" />
            <Button
              my={'sm'}
              fullWidth
              loading={loading}
              sx={(theme) => ({
                backgroundColor: theme.colors.violet[8],
                color: theme.colors.white,
                borderColor: theme.colors.violet[8],
                '&:hover': {
                  backgroundColor: theme.colors.violet[9],
                  borderColor: theme.colors.violet[9],
                },
              })}
              onClick={() => {
                signInWithProvider('twitch', setLoading);
              }}
            >
              <FAIcon
                icon={faTwitch}
                css={{
                  mx: '$1',
                }}
              />
              Login with Twitch
            </Button>
            <Button
              my={'sm'}
              fullWidth
              loading={loading}
              sx={(theme) => ({
                backgroundColor: theme.colors.indigo[8],
                color: theme.colors.white,
                borderColor: theme.colors.indigo[8],
                '&:hover': {
                  backgroundColor: theme.colors.indigo[9],
                  borderColor: theme.colors.indigo[9],
                },
              })}
              onClick={() => {
                signInWithProvider('discord', setLoading);
              }}
            >
              <FAIcon
                icon={faDiscord}
                css={{
                  mx: '$1',
                }}
              />
              Login with Discord
            </Button>
            {/* <Button
                  css={{
                    width: '100%',
                    mb: '$1',
                    color: 'white',
                    backgroundColor: '#1DA1F2',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('twitter');
                  }}
                >
                  <FAIcon
                    icon={faTwitter}
                    css={{
                      mx: '$1',
                    }}
                  />
                  Login with Twitter
                </Button> */}
            {/* <Button
                  css={{
                    width: '100%',
                    mb: '$1',
                    color: 'white',
                    backgroundColor: '#4267B2',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('facebook');
                  }}
                >
                  <FAIcon
                    icon={faFacebook}
                    css={{
                      mx: '$1',
                    }}
                  />
                  Login with Facebook
                </Button> */}
            <Button
              my={'sm'}
              fullWidth
              loading={loading}
              sx={(theme) => ({
                backgroundColor: theme.colors.gray[8],
                color: theme.colors.white,
                borderColor: theme.colors.gray[8],
                '&:hover': {
                  backgroundColor: theme.colors.gray[9],
                  borderColor: theme.colors.gray[9],
                },
              })}
              onClick={() => {
                signInWithProvider('google', setLoading);
              }}
            >
              <FAIcon
                icon={faGoogle}
                css={{
                  mx: '$1',
                }}
              />
              Login with Google
            </Button>
          </Grid.Col>
          <Grid.Col xs={2} md={1}>
            <Image
              css={{
                borderTopRightRadius: '$4',
                borderBottomRightRadius: '$4',
              }}
              src="https://bounti-images.s3.us-east-1.amazonaws.com/pexels-photo-7862418.jpeg"
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export async function getServerSideProps(ctx) {
  let user = null;
  try {
    user = await getUser(ctx);
  } catch (error) {
    console.log(error);
  }

  if (user.user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

export default SignUp;
