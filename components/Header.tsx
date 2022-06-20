import React, { useState } from 'react';
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
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import ColorSwitch from './ColorSwitch';
import Link from 'next/link';

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
  { link: '/games', label: 'Games' },
  { link: '/bounties', label: 'Bounties' },
  { link: '/signup', label: 'Sign Up' },
  { link: '/login', label: 'Login' },
];
export function Header() {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
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
