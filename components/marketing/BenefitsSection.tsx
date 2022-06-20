import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faComment,
  faUserAstronaut,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
import { Text, Title, Grid } from '@mantine/core';

const MarketingSection = ({ title, description, icon, content, color }) => {
  return (
    <div>
      <Text component="div" size="xl" weight={700}>
        <Text component="span" color={color} size="xl" mr={10} weight={700}>
          <FontAwesomeIcon icon={icon} />
        </Text>
        {title}
      </Text>
      <Text color={color} weight={'bold'}>
        {description}
      </Text>
      <Text component="p" size="lg">
        {content}
      </Text>
    </div>
  );
};
export const BenefitsSection = () => {
  return (
    <main>
      <Title my={50} order={2}>
        Indie Games thrive here
      </Title>

      <Grid columns={2}>
        <Grid.Col span={1}>
          <MarketingSection
            title="Play"
            description="Play games with friends"
            icon={faGamepad}
            content={`Many game ideas fall to the wayside as they are considered too niche to be picked up by
              major publishers. We're changing that. Bounti has games of all shapes and sizes - no matter
              how niche.`}
            color="cyan"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <MarketingSection
            title="Collaborate"
            description="Help build awesome gaming communities"
            icon={faComment}
            content={`Help build a game's community. Create discussions, share ideas and give feedback that
            will help the game grow. Get responses from game developers and get rewards for
            contributing to the development of the game`}
            color="red"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <MarketingSection
            title="Promote"
            description="Support your favorite developers"
            icon={faUserAstronaut}
            content={`With bounti, you can support your favorite game developers. Help beta test and improve
            the quality of indie games and get rewarded for doing so.`}
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <MarketingSection
            title="Earn"
            description="Get rewarded for bounties"
            icon={faSackDollar}
            content={`Get paid for completing bounties and promoting video games. Help beta test and influence
            upcoming games.`}
            color="yellow"
          />
        </Grid.Col>
      </Grid>
    </main>
  );
};
