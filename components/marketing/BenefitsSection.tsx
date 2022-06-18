import React from 'react';
import {
  Box,
  Grid,
  Text,
  Container,
  Flex,
  Heading,
  Paragraph,
  Section,
  Separator,
  darkTheme,
} from '@modulz/design-system';
import { MarketingCaption } from './MarketingCaption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faGamepad,
  faComment,
  faUserAstronaut,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';

export const BenefitsSection = () => {
  return (
    <Section
      css={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container size="3">
        <Box css={{ mb: '$7' }}>
          <Heading
            as="h2"
            size="3"
            css={{
              color: '$slate12',
            }}
          >
            Indie Games thrive here
          </Heading>
        </Box>

        <Grid
          columns={{ '@initial': 1, '@bp1': 2 }}
          gapX={{ '@initial': 4, '@bp1': 7, '@bp2': 9 }}
          gapY={{ '@initial': 3, '@bp1': 5, '@bp2': 7 }}
        >
          <Box>
            <Text
              as="h3"
              size="7"
              css={{
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.3,
                mb: '$2',
                color: '$slate12',
              }}
            >
              <Text
                as="span"
                size="7"
                css={{
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  display: 'inline-block',
                  mr: '$3',
                  color: '$teal10',
                  lineHeight: 1.3,
                  mb: '$2',
                }}
              >
                <FontAwesomeIcon icon={faGamepad} />
              </Text>
              Play
            </Text>
            <MarketingCaption variant="teal" css={{ mb: '$3' }}>
              Discover amazing games.
            </MarketingCaption>
            <Paragraph css={{ mb: '$5', color: '$gray12' }}>
              {/* It takes a <em style={{ fontFamily: 'Georgia, serif' }}>lot</em> of time to develop
              and maintain robust UI components, and it's mostly undifferentiated work. Building on
              top of Radix components will save you time and money, so you can ship a better product
              faster. */}
              Many game ideas fall to the wayside as they are considered too niche to be picked up
              by major publishers. We're changing that. Bounti has games of all shapes and sizes -
              no matter how niche.
            </Paragraph>
          </Box>
          <Box>
            <Text
              as="h3"
              size="7"
              css={{
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.3,
                mb: '$2',
                color: '$slate12',
              }}
            >
              <Text
                as="span"
                size="7"
                css={{
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  display: 'inline-block',
                  mr: '$3',
                  color: '$red10',
                  lineHeight: 1.3,
                  mb: '$2',
                }}
              >
                <FontAwesomeIcon icon={faComment} />
              </Text>
              Collaborate
            </Text>
            <MarketingCaption variant={'red'} css={{ mb: '$3' }}>
              Help build awesome gaming communities.
            </MarketingCaption>

            <Paragraph css={{ mb: '$5', color: '$gray12' }}>
              Help build a game's community. Create discussions, share ideas and give feedback that
              will help the game grow. Get responses from game developers and get rewards for
              contributing to the development of the game
            </Paragraph>
          </Box>
          <Box>
            <Text
              as="h3"
              size="7"
              css={{
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.3,
                mb: '$2',
                color: '$slate12',
              }}
            >
              <Text
                as="span"
                size="7"
                css={{
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  display: 'inline-block',
                  mr: '$3',
                  color: '$blue10',
                  mb: '$2',
                }}
              >
                <FontAwesomeIcon icon={faUserAstronaut} />
              </Text>
              Promote
            </Text>
            <MarketingCaption variant={'blue'} css={{ mb: '$3' }}>
              Support your favorite developers.
            </MarketingCaption>
            <Paragraph css={{ mb: '$5', color: '$gray12' }}>
              With bounti, you can support your favorite game developers. Help beta test and improve
              the quality of indie games and get rewarded for doing so.
            </Paragraph>
          </Box>
          <Box>
            <Text
              as="h3"
              size="7"
              css={{
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.3,
                mb: '$2',
                color: '$slate12',
              }}
            >
              <Text
                as="span"
                size="7"
                css={{
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  display: 'inline-block',
                  mr: '$3',
                  color: '$gold10',
                  lineHeight: 1.3,
                  mb: '$2',
                }}
              >
                <FontAwesomeIcon icon={faSackDollar} />
              </Text>
              Earn
            </Text>
            <MarketingCaption variant={'gold'} css={{ mb: '$3' }}>
              Get rewarded for bounties
            </MarketingCaption>
            <Paragraph css={{ mb: '$5', color: '$gray12' }}>
              Get paid for completing bounties and promoting video games. Help beta test and
              influence upcoming games.
            </Paragraph>
          </Box>
        </Grid>
      </Container>
    </Section>
  );
};
