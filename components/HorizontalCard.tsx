//@ts-nocheck

import React from 'react';
import { createStyles, Card, Image, Avatar, Text, Group } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    lineHeight: 1.2,
  },

  body: {
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    margin: theme.spacing.sm,
  },
}));

interface ArticleCardVerticalProps {
  image: string;
  category: string;
  title: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
}

export default function ArticleCardVertical({ game }: ArticleCardVerticalProps) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" px={20} className={classes.card}>
      <Group noWrap spacing={0}>
        <Image src={game.featured_image} />
        <div className={classes.body}>
          {/* <Text transform="uppercase" color="dimmed" weight={700} size="xs">
            {category}
          </Text> */}
          <Text className={classes.title} mb="md">
            {game.name}
          </Text>
          <Text mt="xs">{game.summary}</Text>
          {/* <Group noWrap spacing="xs">
            <Group spacing="xs" noWrap>
              <Avatar size={20} src={author.avatar} />
              <Text size="xs">{author.name}</Text>
            </Group>
            <Text size="xs" color="dimmed">
              •
            </Text>
            <Text size="xs" color="dimmed">
              {date}
            </Text>
          </Group> */}
        </div>
      </Group>
    </Card>
  );
}
