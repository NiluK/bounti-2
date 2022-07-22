//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { useTheme } from 'next-themes';
import {
  supabaseServerClient,
  supabaseClient,
  withPageAuth,
  getUser,
} from '@supabase/auth-helpers-nextjs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Button,
  Box,
  Paper,
  Container,
  TextInput,
  Textarea,
  Text,
  Title,
  Modal,
  Checkbox,
  createStyles,
  MultiSelect,
  Select,
  Grid,
} from '@mantine/core';
import DropZone from '@components/Dropzone';
import Link from 'next/link';
import RichTextEditor from '@components/RichText';
import { Widget } from '@typeform/embed-react';

import { useForm, useController, Controller } from 'react-hook-form';
import { camelCase } from 'lodash';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';
import { Database, Video } from 'tabler-icons-react';
import { TypographyStylesProvider } from '@mantine/core';

const getData = async (table) => {
  const { data } = await supabaseClient.from(table).select('*');
  return data;
};

const getDeveloper = async (user) => {
  const { data } = await supabaseClient
    .from('developer')
    .select('*, developer_game(game(*))')
    .eq('user_uuid', user.id)
    .single();

  return data;
};

const handleImageUpload = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('https://api.imgbb.com/1/upload?key=api_key', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => resolve(result.data.url))
      .catch(() => reject(new Error('Upload failed')));
  });

const useStyles = createStyles((theme) => ({
  description: {
    textDecoration: 'none',

    img: {
      width: '100%',
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

  link: {
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[8],
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '5px',
  },

  linkActive: {
    textDecoration: 'none',
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export default function BountiNew(props) {
  // const [category, setCategory] = useState(props.category);
  // const [platform, setPlatform] = useState(props.platform);
  // const [feature, setFeature] = useState(props.feature);
  // const [developer, setDeveloper] = useState(props.developer);
  const [bounti, setBounti] = useState(props.bounti);
  // const [loading, setLoading] = useState(false);
  // const user = useUser();
  // const router = useRouter();
  const { classes } = useStyles();

  // const { register, handleSubmit, control } = useForm();

  // // const onSubmit = async (data) => {
  // //   try {
  // //     setLoading(true);

  // //     const { data: bounti } = await supabaseClient
  // //       .from('bounti')
  // //       .insert({
  // //         title: data.title,
  // //         subtitle: data.subtitle,
  // //         slug: camelCase(data.title),
  // //         instructions: data.instructions,
  // //         non_monetary_rewards: data.non_monetary_rewards,
  // //         reward_distribution: data.reward_distribution,
  // //         reward_deadline: data.reward_deadline,
  // //         reward_number: data.reward_number,
  // //         reward_value: data.reward_value,
  // //         file: data.file,
  // //         build: data.build,
  // //       })
  // //       .single();

  // //     console.log('bounti', bounti);

  // //     const featuredImage = await supabaseClient.storage
  // //       .from('bounti')
  // //       .upload(`${bounti.uuid}/featured-image/${data.featuredImage.path}`, data.featuredImage, {
  // //         upsert: true,
  // //       });

  // //     const { data: bounti_category } = await supabaseClient
  // //       .from('bounti_categoty')
  // //       .insert({
  // //         category_uuid: data.category,
  // //         bounti_uuid: bounti.uuid,
  // //       })
  // //       .single();

  // //     const { data: game } = await supabaseClient
  // //       .from('bounti_game')
  // //       .insert({
  // //         game_uuid: data.game,
  // //         bounti_uuid: bounti.uuid,
  // //       })
  // //       .single();

  // //     for (const platform in data.platform) {
  // //       const { data: game_platform } = await supabaseClient
  // //         .from('bounti_platform')
  // //         .insert({
  // //           platform_uuid: data.platform[platform],
  // //           bounti_uuid: bounti.uuid,
  // //         })
  // //         .single();
  // //     }

  // //     const { data: updatedDeveloper } = await supabaseClient
  // //       .from('bounti_developer')
  // //       .insert({
  // //         developer_uuid: developer.uuid,
  // //         bounti_uuid: bounti.uuid,
  // //       })
  // //       .match({ uuid: developer })
  // //       .single();

  // //     const { data: updatedBounti } = await supabaseClient
  // //       .from('game')
  // //       .update({
  // //         featured_image: `https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${featuredImage.data.Key}`,
  // //       })
  // //       .match({ uuid: bounti.uuid })
  // //       .single();

  // //     setLoading(false);

  // //     router.push(`/bounties/${updatedBounti.slug}`);
  // //   } catch (error) {
  // //     console.log(error);
  // //     setLoading(false);
  // //   }
  // // };

  // const games = developer?.developer_game;

  // console.log('games', games);

  // useEffect(() => {
  //   if (!category.length) {
  //     const category = getData('category');
  //     category(category);
  //   }
  //   if (!platform.length) {
  //     const platform = getData('platform');
  //     setPlatform(platform);
  //   }
  //   if (!feature.length) {
  //     const feature = getData('feature');
  //     setFeature(feature);
  //   }
  //   if (!developer) {
  //     const developer = getDeveloper(user);
  //     setDeveloper(developer);
  //   }
  // }, [category, platform, feature, developer]);

  // const categoryData = Array.isArray(category)
  //   ? category.map((category) => {
  //       return {
  //         label: category.name,
  //         value: category.uuid,
  //       };
  //     })
  //   : [];
  // const [categorySetData, setCategorySetData] = useState(categoryData);

  // const platformData = Array.isArray(platform)
  //   ? platform.map((platform) => {
  //       return {
  //         label: platform.name,
  //         value: platform.uuid,
  //       };
  //     })
  //   : [];

  // const gamesData = Array.isArray(games)
  //   ? games.map(({ game }) => {
  //       return {
  //         label: game.name,
  //         value: game.uuid,
  //       };
  //     })
  //   : [];
  // const featureData = Array.isArray(feature)
  //   ? feature.map((feature) => {
  //       return {
  //         label: feature.name,
  //         value: feature.uuid,
  //       };
  //     })
  //   : [];

  const router = useRouter();

  const slug = router.query.slug;

  const map = {
    funEralSimulatorBounti: 'MJF1m4N4',
    f1abTestBounti: 'X66Co7fc',
  };

  return (
    <>
      <TitleAndMetaTags title={`Create new Submission`} />
      <Container my={20} size={'xl'}>
        <Grid columns={2}>
          <Grid.Col span={1}>
            <Title order={3} mb="md">
              Game Link
            </Title>
            <Paper p="xl">
              <a href={bounti.file} target="_blank">
                <Text
                  color="orange"
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  {bounti.file}
                </Text>
              </a>
            </Paper>
            <Title order={3} my="md">
              Instructions
            </Title>
            <Paper shadow="xs" radius="md" p="xl" withBorder>
              <TypographyStylesProvider>
                <div
                  dangerouslySetInnerHTML={{ __html: bounti?.instructions }}
                  className={classes.description}
                />
              </TypographyStylesProvider>
            </Paper>
          </Grid.Col>

          <Grid.Col span={1}>
            <Title order={3} mb="md">
              Submission Form
            </Title>
            <Paper shadow="xs" radius="md" p="xl" withBorder>
              {map[slug] ? (
                <Widget id={map[slug]} height={600} />
              ) : (
                <>Submissions are currently disabled for this bounti</>
              )}
            </Paper>
            {/* <Paper p={20} withBorder shadow={'xs'} my="xl">
              <Title order={2}>Create New Submission</Title>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Textarea
                  my="sm"
                  required
                  label="Submission Text"
                  placeholder=""
                  {...register('subtitle')}
                />

                <Controller
                  name="video"
                  control={control}
                  render={({ field }) => (
                    <Button leftIcon={<Video />} my="sm">
                      Upload Submission Video
                    </Button>
                  )}
                />

                <Controller
                  name="game"
                  control={control}
                  render={({ field }) => (
                    <Select
                      my={'sm'}
                      data={gamesData}
                      searchable
                      label="Associated Bounti"
                      placeholder="Adventure, action, etc."
                      clearButtonLabel="Clear selection"
                      clearable
                      multiple
                      required
                      {...field}
                    />
                  )}
                />

                <Button
                  my="lg"
                  sx={{
                    marginRight: 0,
                    marginLeft: 'auto',
                    display: 'flex',
                  }}
                  type="submit"
                  size={'md'}
                  loading={loading}
                >
                  Create Submission
                </Button>
              </form>
            </Paper> */}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  // let user;
  // try {
  //   user = await getUser(ctx);
  // } catch (e) {
  //   console.error(e);
  //   user = null;
  // }

  // if (!user.user) {
  //   return {
  //     props: {
  //       redirect: {
  //         pathname: '/login',
  //       },
  //     },
  //   };
  // }
  const { data: category } = await supabaseServerClient(ctx).from('category').select('*');
  const { data: platform } = await supabaseServerClient(ctx).from('platform').select('*');
  const { data: feature } = await supabaseServerClient(ctx).from('feature').select('*');
  const { data: bounti = {} } = await supabaseServerClient(ctx)
    .from('bounti')
    .select(
      '*, bounti_developer(developer(*)), bounti_category(category(*)), bounti_platform(platform(*)), bounti_game(game(*)), bounti_submission(submission(*)))'
    )
    .eq('slug', ctx.params.slug)
    .single();

  const { data: developer = {} } = await supabaseServerClient(ctx)
    .from('developer')
    .select('*, bounti_developer(bounti(*))')
    .eq('uuid', bounti.bounti_developer[0].developer.uuid)
    .single();
  return {
    props: {
      developer,
      category,
      platform,
      feature,
      bounti,
    },
  };
};
