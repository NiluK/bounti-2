import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Heading,
  Link,
  Paragraph,
  Section,
  Separator,
  TextField,
  Image,
  Button,
} from '@modulz/design-system';
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

async function signInWithProvider(provider) {
  const { user, session, error } = await supabaseClient.auth.signIn(
    {
      provider,
    },
    {
      redirectTo: `${window.location.origin}/signup`,
    }
  );
}

async function signInWithEmail(email) {
  const { user, error } = await supabaseClient.auth.signIn(
    {
      email,
    },
    {
      redirectTo: `${window.location.origin}/signup`,
    }
  );
}

const Hr = styled('hr');
const FAIcon = styled(FontAwesomeIcon);

const Login = ({ game = {} }) => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);
  return (
    <Container size={{ '@initial': 2, '@bp2': 3 }}>
      <Section css={{ backgroundColor: '$slate4', borderRadius: '$4', m: '$2', p: '0' }}>
        <Grid
          css={{
            '@bp2': {
              gap: '$1',
              gridTemplateColumns: '1fr 1fr',
              placeItems: 'center',
            },
          }}
        >
          <Box
            css={{
              m: '$6',
            }}
          >
            <Heading
              size="1"
              css={{
                my: '$5',
                textAlign: 'center',
              }}
            >
              Login to
              <Text
                css={{
                  fontFamily: 'Krona One',
                  display: 'inline',
                  fontSize: '$5',
                  color: '$orange10',
                  mx: '$2',
                }}
              >
                Bounti
              </Text>
            </Heading>
            <Box
              css={{
                mb: '$2',
              }}
            >
              <TextField
                type="text"
                className="input"
                placeholder="Your Email"
                size="2"
                css={{
                  background: '$slateA4',
                  '&::placeholder': {
                    color: '$slate12',
                  },
                }}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Box>
            <Button
              css={{
                width: '100%',
                backgroundColor: '$orange9',
              }}
              size="2"
              onClick={() => {
                signInWithEmail(email);
              }}
            >
              Login
            </Button>
            <Box
              css={{
                mb: '$2',
              }}
            >
              <Text
                as="span"
                css={{
                  my: '$5',
                  textAlign: 'center',
                  color: '$blackA12',
                }}
                size="6"
              >
                <Hr as="hr" css={{ borderColor: '$slate3', my: '$4' }} />
                {/* <Button
                  css={{
                    width: '100%',
                    mb: '$1',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('github');
                  }}
                >
                  <FAIcon
                    icon={faGithub}
                    css={{
                      mx: '$1',
                    }}
                  />{' '}
                  <Text
                    css={{
                      fontWeight: '500',
                    }}
                  >
                    Login with Github
                  </Text>
                </Button> */}
                <Button
                  css={{
                    width: '100%',
                    mb: '$1',
                    backgroundColor: '#9046FF',
                    color: 'white',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('twitch');
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
                  css={{
                    width: '100%',
                    mb: '$1',
                    backgroundColor: '#5769E9',
                    color: 'white',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('discord');
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
                  css={{
                    width: '100%',
                    mb: '$1',
                  }}
                  size="2"
                  onClick={() => {
                    signInWithProvider('google');
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
              </Text>
            </Box>
          </Box>
          <Image
            css={{
              borderTopRightRadius: '$4',
              borderBottomRightRadius: '$4',
            }}
            src="https://bounti-images.s3.us-east-1.amazonaws.com/pexels-photo-7862418.jpeg"
          />
        </Grid>
      </Section>
    </Container>
  );
};

export default Login;
