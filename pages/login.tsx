import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
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
import {
  Container,
  Paper,
  Grid,
  Text,
  Title,
  TextInput,
  Button,
  Divider,
  Image,
  Modal,
} from '@mantine/core';
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

const Login = ({ game = {} }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

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
          gutter={'xl'}
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
              Login to
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
                setOpened(true);
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
            <Modal
              opened={opened}
              size={'lg'}
              title=" Check your Email "
              onClose={() => setOpened(false)}
              sx={{
                marginTop: '60px',
                img: {
                  maxWidth: '100%',
                },
              }}
            >
              <Title order={3}></Title>
              <Text my="lg">
                We've emailed you a magic link to{' '}
                <Text weight="bold" color={'orange'} component="span">
                  {email}{' '}
                </Text>
                .
                <br />
                Click that link to login or sign up
              </Text>
            </Modal>
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
            <Image src="https://bounti-images.s3.us-east-1.amazonaws.com/pexels-photo-7862418.jpeg" />
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

export default Login;
