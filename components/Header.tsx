import React, { useContext, useState, useEffect } from 'react';
import {
  createStyles,
  Header as Nav,
  Container,
  Group,
  Burger,
  Paper,
  Anchor,
  Transition,
  Text,
  Menu,
  UnstyledButton,
  Divider,
  Avatar,
} from '@mantine/core';

import {
  Logout,
  Heart,
  Star,
  Message,
  Settings,
  PlayerPause,
  Trash,
  SwitchHorizontal,
  ChevronDown,
} from 'tabler-icons-react';

import { useBooleanToggle } from '@mantine/hooks';
import ColorSwitch from './ColorSwitch';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import {
  fetchProfile,
  fetchProfileType,
  getProfileType,
  setProfileType,
} from 'store/profile/profileSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    zIndex: 1000,
    position: 'sticky',
    top: 0,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  logo: {
    color: 'transparent',
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    fontFamily: 'Krona One, sans-serif',
    backgroundImage: `linear-gradient(180deg, ${theme.colors.orange[8]}, ${theme.colors.red[8]})`,
    // Use padding rather than margin, or otherwise some descenders
    // may be clipped with WebkitBackgroundClip: 'text'
    fontWeight: 500,
    lineHeight: '1.6',
    fontSize: '30px',
    [theme.fn.smallerThan('sm')]: {
      fontSize: '30px',
      lineHeight: '1.16',
    },
  },
  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 2],
  },

  user: {
    color: theme.colorScheme === 'dark' ? '#fff' : '#000',
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 2],
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
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

const links = [
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/games', label: 'Games' },
  { link: '/bounties', label: 'Bounties' },
];

const loggedOutlinks = [
  { link: '/signup', label: 'Sign Up' },
  { link: '/login', label: 'Login' },
];

export function Header(props) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes, cx, theme } = useStyles();

  const user = props.user || useUser().user;

  console.log(user);

  const dispatch = useDispatch();
  const profileType = useSelector(getProfileType);

  useEffect(() => {
    dispatch(fetchProfileType({ user }) as unknown as AnyAction);
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(fetchProfile({ user, profile: profileType }) as unknown as AnyAction);
  }, [profileType, dispatch]);

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  console.log('profileType', profileType);

  const items = links.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={cx(classes.link)}>{link.label}</a>
    </Link>
  ));

  const loggedOutItems = loggedOutlinks.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={cx(classes.link)}>{link.label}</a>
    </Link>
  ));

  return (
    <Nav height={HEADER_HEIGHT} className={classes.root}>
      <Container size="xl" className={classes.header}>
        <Anchor component={Link} href="/">
          <Text className={classes.logo}> Bounti</Text>
        </Anchor>
        <Group spacing={5} className={classes.links}>
          {items}
          {user?.user_metadata ? (
            <Menu
              size={260}
              placement="end"
              transition="pop-top-right"
              className={classes.userMenu}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              control={
                <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={user?.user_metadata.avatar_url}
                      alt={user?.user_metadata.full_name}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" mr={3}>
                      {user?.user_metadata.full_name}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              }
            >
              <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
                Liked posts
              </Menu.Item>
              <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
                Saved posts
              </Menu.Item>
              <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
              <Menu.Item
                icon={<SwitchHorizontal size={14} />}
                onClick={() =>
                  dispatch(
                    setProfileType({
                      type: profileType === 'player' ? 'developer' : 'player',
                      user,
                    }) as unknown as AnyAction
                  )
                }
              >
                Switch to {profileType === 'player' ? 'Developer' : 'Player'} Profile
              </Menu.Item>
              <Link href="/api/auth/logout" passHref>
                <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>
              </Link>

              <Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<PlayerPause size={14} />}>Pause subscription</Menu.Item>
              <Menu.Item color="red" icon={<Trash size={14} />}>
                Delete account
              </Menu.Item>
            </Menu>
          ) : (
            loggedOutItems
          )}
          <ColorSwitch />
        </Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <>
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            </>
          )}
        </Transition>
      </Container>
    </Nav>
  );
}
