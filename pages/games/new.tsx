import React from 'react';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Grid,
  Link,
  Paragraph,
  Heading,
  TextField,
  Section,
  Separator,
  Select,
  Image,
  styled,
  keyframes,
  Text,
  TextArea,
  Dialog,
  Button,
} from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { CaseStudyLogoVariant } from '@components/marketing/CaseStudyLogo';
import supabase from '@lib/supabase';
import { useTheme } from 'next-themes';
import { supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$blackA9',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: '$slate1',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '600px',
  maxHeight: '85vh',
  overflow: 'scroll',
  padding: 25,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
  img: {
    maxWidth: '100%',
  },
});

const Label = styled('label', {
  display: 'block',
  my: '$3',
});

export default function CaseStudy({ game = {} }) {
  const { theme } = useTheme();

  const developer = game?.developer_game?.[0]?.developer || {};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(watch('example'));

  const preview = watch('description');

  return (
    <>
      <TitleAndMetaTags
        title={`${game.name} – Case studies – Radix UI`}
        description={game.description}
        image={game.featuredImage}
      />
      <Container size={2}>
        <Section>
          <Heading
            size="2"
            as="h1"
            css={{
              display: 'inline-flex',
              my: '$3',
            }}
          >
            Create New Game
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <Grid columns={2}>
              <Box>
                <Label htmlFor="name">Game Name </Label>
                <TextField size="2" defaultValue="test" {...register('name')} id="name" />
              </Box>
            </Grid>
            <Grid
              css={{
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Label htmlFor="description">
                Game Description
                <Text
                  as="span"
                  css={{
                    color: '$slate9',
                    display: 'none',
                    ml: '$1',
                    '@bp2': { display: 'inline' },
                  }}
                >
                  (Supports Markdown)
                </Text>
              </Label>
              <DialogPrimitive.Root>
                <DialogPrimitive.Trigger asChild>
                  <Link
                    css={{
                      display: 'inline',
                      color: '$slate11',
                      textAlign: 'right',
                      my: '$3',
                      textDecoration: 'none',
                    }}
                  >
                    View Preview
                  </Link>
                </DialogPrimitive.Trigger>
                <DialogPrimitive.Portal>
                  <StyledOverlay />
                  <StyledContent>
                    <ReactMarkdown
                      children={preview}
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    />
                  </StyledContent>
                </DialogPrimitive.Portal>
              </DialogPrimitive.Root>
            </Grid>
            <TextArea
              rows={10}
              size={2}
              defaultValue="test"
              {...register('description')}
              id="description"
            />
            <Label htmlFor="name">Game Genre</Label>
            <Select defaultValue="test" {...register('genre')} id="genre" />
            <Label htmlFor="name">Game Platform</Label>
            <Select defaultValue="test" {...register('platform')} id="platform" />
            <Label htmlFor="name">Game Features</Label>
            <Select defaultValue="test" {...register('features')} id="features" />

            {errors.exampleRequired && <span>This field is required</span>}
            <Button
              css={{
                my: '$3',
              }}
              type="submit"
              size={2}
            >
              {' '}
              Button{' '}
            </Button>
          </form>
        </Section>
      </Container>
      {/*
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
      </Container> */}
    </>
  );
}

export async function getServerSideProps(ctx) {
  // const { data } = await supabaseServerClient(ctx)
  //   .from('game')
  //   .select('*, developer_game(developer(*)) as developer')
  //   .eq('slug', slug)
  //   .single();
  return {
    props: {},
  };
}
