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
      <BenefitsSection />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { data, error } = await supabaseServerClient(ctx).from('game').select('*');
  return {
    props: {
      games: data,
    },
  };
}
