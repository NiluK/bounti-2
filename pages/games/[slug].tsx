import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Link,
  Paragraph,
  Section,
  Separator,
  Image,
  darkTheme,
} from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MDXProvider, components } from '@components/MDXComponents';
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx';
import { Header } from '@components/Header-radix';
import { MarketingCaption } from '@components/marketing/MarketingCaption';
import { CaseStudyLogo, CaseStudyLogoVariant } from '@components/marketing/CaseStudyLogo';
import { Footer } from '@components/Footer';
import { BoxLink } from '@components/BoxLink';
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { BenefitsSection } from '@components/marketing/BenefitsSection';
import { GameHero } from '@components/games/GameHero';
import supabase from '@lib/supabase';
import { useTheme } from 'next-themes';

type CaseStudyPage = {
  frontmatter: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    author: string;
    authorAvatarUrl: string;
    authorPosition: string;
    productsUsed: string;
    companyAbout: string;
    companyUrl: string;
    companyFounded: string;
    companyLogoVariant: CaseStudyLogoVariant;
    companyLogoWidth: string;
    nextCaseStudyTitle: string;
    nextCaseStudySlug: string;
  };
  code: string;
};

export default function CaseStudy({ game = {} }: CaseStudyPage) {
  const { theme } = useTheme();

  console.log('theme', theme);

  const developer = game?.developer_game?.[0]?.developer || {};

  return (
    <>
      <TitleAndMetaTags
        title={`${game.name} – Case studies – Radix UI`}
        description={game.description}
        image={game.featuredImage}
      />
      <Container size={{ '@initial': 2, '@bp2': 3 }}>
        <Section>
          <Grid
            css={{
              '@bp2': {
                gap: '$9',
                gridTemplateColumns: '1fr 330px',
              },
              '@bp3': {
                gap: 120,
                gridTemplateColumns: '1fr 380px',
              },
            }}
          >
            <Container size="2">
              <GameHero game={game} />
              <Paragraph
                css={{
                  color: '$slate11',
                }}
              >
                {game.description}
              </Paragraph>

              {/*
              <MarketingCaption css={{ mb: '$1' }}>Case study</MarketingCaption>
              <MDXProvider frontmatter={frontmatter}>
                <Component components={components as any} />
                <Component components={components as any} />
              </MDXProvider>
              <Flex align="center" gap="3" css={{ mt: '$7' }}>
                <Avatar size="5" src={frontmatter.authorAvatarUrl} aria-describedby="author" />
                <Box id="author">
                  <Paragraph css={{ fontWeight: 500 }}>{frontmatter.author}</Paragraph>
                  <Paragraph>{frontmatter.authorPosition}</Paragraph>
                </Box>
              </Flex>
              <Separator size="2" css={{ mt: '$7', '@bp2': { mt: '$9' } }} /> */}
            </Container>

            <Box css={{ position: 'relative', mt: '$7', '@bp2': { mt: 100 } }}>
              <Box css={{ position: 'sticky', top: '$9', left: 0 }}>
                <Box
                  css={{
                    mb: '$6',
                  }}
                >
                  <BoxLink
                    target="_blank"
                    href={`https://${game.companyUrl}`}
                    style={{
                      display: 'inline-block',
                    }}
                  >
                    <Image
                      src={developer.logo}
                      css={{
                        maxWidth: '380px',
                        maxHeight: '100px',
                        filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                      }}
                    />
                  </BoxLink>
                </Box>
                <Box css={{ mb: '$5' }}>
                  <Paragraph as="h4" css={{ fontWeight: 500 }}>
                    About
                  </Paragraph>
                  <Paragraph css={{ mb: '$1' }}>{game.companyAbout}</Paragraph>
                  <Paragraph>
                    <Link
                      target="_blank"
                      href={`https://${game.companyUrl}`}
                      css={{ display: 'inline-flex' }}
                    >
                      {game.companyUrl}
                      <ArrowTopRightIcon style={{ marginLeft: -1, marginBottom: -2 }} />
                    </Link>
                  </Paragraph>
                </Box>
                <Box css={{ mb: '$5' }}>
                  <Paragraph as="h4" css={{ fontWeight: 500 }}>
                    Founded
                  </Paragraph>
                  <Paragraph>{game.companyFounded}</Paragraph>
                </Box>
                <Separator size="2" css={{ my: '$7' }} />
                <Box css={{ mb: '$5' }}>
                  <Paragraph as="span" css={{ fontWeight: 500 }}>
                    Next case study
                  </Paragraph>
                  <Paragraph as="span">
                    <NextLink href={`/${game.nextCaseStudySlug}`} passHref>
                      <Link>{game.nextCaseStudyTitle}</Link>
                    </NextLink>
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Section>
      </Container>
    </>
  );
}

export async function getStaticPaths(params) {
  const { data: games } = await supabase.from('game').select('slug');
  const paths = games.map(({ slug }) => {
    return {
      params: {
        slug: slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const { data: game = {} } = await supabase
    .from('game')
    .select('*, developer_game(developer(*)) as developer')
    .eq('slug', slug)
    .single();
  return {
    props: {
      game,
    },
  };
}
