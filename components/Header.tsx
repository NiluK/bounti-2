import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Text,
  Button,
  styled,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Flex,
  Link,
  Avatar,
} from '@modulz/design-system';
import { BoxLink } from '@components/BoxLink';
import { ThemeToggle } from './ThemeToggle';

import { useContext } from 'react';
import { UserContext } from '@lib/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOut, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import supabase from '@lib/supabase';

const logout = async () => {
  await supabase.auth.signOut();
};

export const Header = () => {
  const router = useRouter();
  const isColors = router.pathname.includes('/colors') || router.pathname.includes('/docs/colors');

  const { user: fullUser, profile } = useContext(UserContext);
  const user = fullUser?.user_metadata;

  return (
    <Box
      as="header"
      css={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '$gray1',
      }}
    >
      <Container size="4">
        <Flex align="center" justify="between" css={{ height: '$8' }}>
          <NextLink href={isColors ? '/colors' : '/'} passHref>
            <BoxLink>
              <Text
                as="span"
                size={{ '@initial': 8, '@bp1': 9 }}
                css={{
                  color: 'transparent',
                  display: 'inline-block',
                  WebkitBackgroundClip: 'text',
                  fontFamily: 'Krona One, sans-serif',
                  backgroundImage: 'linear-gradient(180deg, $orange10, $red10)',
                  // Use padding rather than margin, or otherwise some descenders
                  // may be clipped with WebkitBackgroundClip: 'text'
                  fontWeight: 500,
                  lineHeight: '1.6',
                  fontSize: 'min(max($7, 10vw), $7)',
                  letterSpacing: 'max(min(-0.055em, 0.66vw), -0.07em)',
                  '@media (min-width: 900px) and (min-height: 850px)': {
                    fontSize: '30px',
                    lineHeight: '1.16',
                  },
                }}
              >
                Bounti
              </Text>
            </BoxLink>
          </NextLink>

          <Flex
            align="center"
            gap={{ '@initial': 4, '@bp2': 5 }}
            // Baseline align with the logo
            css={{ mb: -2 }}
          >
            <Box css={{ display: 'none', '@bp1': { display: 'contents' } }}>
              <>
                <NextLink href="/games" passHref>
                  <Link>
                    <Text>Games</Text>
                  </Link>
                </NextLink>

                <NextLink href="/case-studies" passHref>
                  <Link>
                    <Text>Bounties</Text>
                  </Link>
                </NextLink>
              </>
            </Box>

            {!user ? (
              <>
                <NextLink href="/signup" passHref>
                  <Link
                    css={{
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                  >
                    <Button
                      css={{
                        background: '$gray4',
                        '&:hover': {
                          background: '$gray5',
                        },
                      }}
                      size={2}
                    >
                      Sign up
                    </Button>
                  </Link>
                </NextLink>
                <NextLink href="/login" passHref>
                  <Link>
                    <Text>Login</Text>
                  </Link>
                </NextLink>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Link
                    variant="subtle"
                    as="button"
                    css={{
                      bc: 'transparent',
                      cursor: 'pointer',
                      appearance: 'none',
                      fontFamily: '$untitled',
                      border: 0,
                      p: 0,
                      m: 0,
                      mr: '-$1',
                    }}
                  >
                    <Avatar size={3} src={user.avatar_url} fallback={user.name} />
                  </Link>
                </PopoverTrigger>
                <PopoverContent hideArrow sideOffset={15} alignOffset={-15}>
                  <Box css={{ p: '$1' }}>
                    <HighlightLink href="/profile">
                      <Flex gap="3">
                        {/* <StitchesLogoIcon
                          width="25"
                          height="25"
                          style={{ flex: 'none', marginTop: 2 }}
                        /> */}
                        <FontAwesomeIcon
                          style={{ flex: 'none', marginTop: 2 }}
                          icon={faUserCircle}
                          size="2x"
                          width="25"
                        />
                        <Box>
                          <Text
                            size="3"
                            as="h3"
                            css={{ fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.02em' }}
                          >
                            Profile
                          </Text>
                          <Text size="2" as="p" variant="gray" css={{ lineHeight: 1.4 }}>
                            Your user profile
                          </Text>
                        </Box>
                      </Flex>
                    </HighlightLink>

                    <NextLink href="/settings" passHref>
                      <HighlightLink>
                        <Flex gap="3">
                          <FontAwesomeIcon
                            style={{ flex: 'none', marginTop: 2 }}
                            icon={faCog}
                            size="2x"
                            width="25"
                          />
                          <Box>
                            <Text
                              size="3"
                              as="h3"
                              css={{ fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.02em' }}
                            >
                              Settings
                            </Text>
                            <Text size="2" as="p" variant="gray" css={{ lineHeight: 1.4 }}>
                              Your settings
                            </Text>
                          </Box>
                        </Flex>
                      </HighlightLink>
                    </NextLink>
                    <HighlightLink
                      onClick={() => {
                        logout();
                      }}
                    >
                      <Flex gap="3">
                        <FontAwesomeIcon
                          style={{ flex: 'none', marginTop: 2, marginLeft: 10 }}
                          icon={faSignOut}
                        />
                        <Box>
                          <Text
                            size="3"
                            as="h3"
                            css={{ fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.02em' }}
                          >
                            Sign Out
                          </Text>
                        </Box>
                      </Flex>
                    </HighlightLink>
                  </Box>
                </PopoverContent>
              </Popover>
            )}
            <ThemeToggle />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

const HighlightLink = styled('a', {
  display: 'block',
  color: '$hiContrast',
  textDecoration: 'none',
  outline: 0,
  p: '$2',
  br: '$2',
  '@hover': {
    '&:hover': {
      bc: '$slateA3',
    },
  },
  '&:focus': {
    boxShadow: '0 0 0 2px $colors$slateA8',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: 'none',
  },
});
