import React from 'react';
import {
  Box,
  Container,
  Separator,
  Grid,
  Text,
  Paragraph,
  Avatar,
  Image,
} from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MainHero } from '@components/marketing/MainHero';
import { ComponentHighlightsSection } from '@components/marketing/ComponentHighlightsSection';
import { CaseStudiesSection } from '@components/marketing/CaseStudiesSection';
import { BenefitsSection } from '@components/marketing/BenefitsSection';
import { AccessibilitySection } from '@components/marketing/AccessibilitySection';
import { DeveloperExperienceSection } from '@components/marketing/DeveloperExperienceSection';
import { AdoptionSection } from '@components/marketing/AdoptionSection';
import { CommunitySection } from '@components/marketing/CommunitySection';
import { OtherProductsSection } from '@components/marke ting/OtherProductsSection';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { FancyBackground } from '@components/marketing/FancyBackground';
import { StatsSection } from '@components/marketing/StatsSection';
import supabase from '@lib/supabase';

export default function PrimitivesHome({ games }) {
  return (
    <Box>
      <TitleAndMetaTags
        title="Primitives – Radix UI"
        description="An open-source React component library for building high-quality, accessible design systems and web apps."
        image="default.png"
      />
      <Container size="3">
        <Grid columns={{ '@initial': 1, '@bp1': 3 }} gap={3}>
          {games.map((game) => (
            <Box
              css={{
                background: '$gray3',
              }}
            >
              <Image
                src={game.featuredImage}
                css={{
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                }}
              />

              <Text
                as="h3"
                size="5"
                css={{
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.3,
                  color: '$slate12',
                  p: '$5',
                }}
              >
                {game.name}
              </Text>
              {/* <MarketingCaption variant="teal" css={{ mb: '$3' }}>
            Discover amazing games.
          </MarketingCaption> */}
            </Box>
          ))}
        </Grid>
        {/* <CaseStudiesSection /> */}
        {/* <Container size="3">
        <Separator size="2" />
      </Container>
      <Box css={{ overflow: 'hidden' }}>
        <BenefitsSection />
        <StatsSection />
      </Box>
      <ComponentHighlightsSection />
      <AccessibilitySection />
      <DeveloperExperienceSection />
      <AdoptionSection />
  */}

        {/* <Container size="3">
        <Separator size="2" />
      </Container>
      <OtherProductsSection />
      <Container size="3">
        <Footer />
      </Container> */}
      </Container>
    </Box>
  );
}

export async function getStaticProps() {
  const { data } = await supabase.from('game').select('*');
  return {
    props: {
      games: data,
    },
  };
}
