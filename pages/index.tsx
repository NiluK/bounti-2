import React from 'react';
// import { Box, Container, Separator } from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MainHero } from '@components/marketing/MainHero';
import { BenefitsSection } from '@components/marketing/BenefitsSection';
import { getUser, supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { Container, createStyles, Divider, Paper } from '@mantine/core';
import { Separator } from '@modulz/design-system';
export default function PrimitivesHome({ games }) {
  return (
    <Container>
      <TitleAndMetaTags
        title="Bounti"
        description="An open-source React component library for building high-quality, accessible design systems and web apps."
        image="default.png"
      />
      <MainHero games={games} />
      <Divider my="xs" label="Label in the center" labelPosition="center" />
      <Paper css={{ overflow: 'hidden' }}>
        <BenefitsSection />
      </Paper>
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
      </Container> */}
      {/* <CommunitySection /> */}
      {/* <Container size="3">
        <Separator size="2" />
      </Container>
      <OtherProductsSection />
      <Container size="3">
        <Footer />
      </Container> */}
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { data } = await supabaseServerClient(ctx).from('game').select('*');
  return {
    props: {
      games: data,
    },
  };
}
