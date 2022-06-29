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
  MultiSelect,
} from '@mantine/core';
import DropZone from '@components/Dropzone';
import Link from 'next/link';
import RichTextEditor from '@components/RichText';

import { useForm, useController, Controller } from 'react-hook-form';
import { camelCase } from 'lodash';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';

const getData = async (table) => {
  const { data } = await supabaseClient.from(table).select('*');
  return data;
};

const getDeveloper = async (user) => {
  const { data } = await supabaseClient
    .from('developer')
    .select('*, developer_game(game(*))')
    .eq('profile_owner', user.id)
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

export default function GameNew(props) {
  const { theme } = useTheme();
  const [opened, setOpened] = useState(false);
  const [genre, setGenre] = useState(props.genre);
  const [platform, setPlatform] = useState(props.platform);
  const [feature, setFeature] = useState(props.feature);
  const [developer, setDeveloper] = useState(props.developer);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  const { register, handleSubmit, watch, control } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      setLoading(true);

      const { data: game } = await supabaseClient
        .from('game')
        .insert({
          name: data.name,
          description: data.description,
          slug: camelCase(data.name),
          website: data.website,
        })
        .single();

      for (const genre in data.genre) {
        const { data: genre_game } = await supabaseClient
          .from('genre_game')
          .insert({
            genre_uuid: data.genre[genre],
            game_uuid: game.uuid,
          })
          .single();
      }

      for (const feature in data.feature) {
        const { data: feature_game } = await supabaseClient
          .from('feature_game')
          .insert({
            feature_uuid: data.feature[feature],
            game_uuid: game.uuid,
          })
          .single();
      }

      for (const platform in data.platform) {
        const { data: platform_game } = await supabaseClient
          .from('platform_game')
          .insert({
            platform_uuid: data.platform[platform],
            game_uuid: game.uuid,
          })
          .single();
      }

      const mediaUrls = [];

      for (const media in data.media) {
        const { data: mediaData } = await supabaseClient.storage
          .from('games')
          .upload(`${game.uuid}/media/${data.media[media].path}`, data.media[media], {
            upsert: true,
          });
        mediaUrls.push(mediaData.Key);
      }

      const featuredImage = await supabaseClient.storage
        .from('games')
        .upload(`${game.uuid}/featured-image/${data.featuredImage.path}`, data.featuredImage, {
          upsert: true,
        });

      const { data: updatedDeveloper } = await supabaseClient
        .from('developer_game')
        .insert({
          developer_uuid: developer.uuid,
          game_uuid: game.uuid,
        })
        .match({ uuid: developer })
        .single();

      const { data: updatedGame } = await supabaseClient
        .from('game')
        .update({
          featured_image: featuredImage.data.Key,
          media: mediaUrls,
        })
        .match({ uuid: game.uuid })
        .single();

      setLoading(false);

      router.push(`/games/${updatedGame.slug}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const game = props.game || {};

  useEffect(() => {
    if (!genre.length) {
      const genre = getData('genre');
      setGenre(genre);
    }
    if (!platform.length) {
      const platform = getData('platform');
      setPlatform(platform);
    }
    if (!feature.length) {
      const feature = getData('feature');
      setFeature(feature);
    }
    if (!developer) {
      const developer = getDeveloper(user);
      setDeveloper(developer);
    }
  }, [genre, platform, feature, developer]);

  const genreData = Array.isArray(genre)
    ? genre.map((genre) => {
        return {
          label: genre.name,
          value: genre.uuid,
        };
      })
    : [];
  const platformData = Array.isArray(platform)
    ? platform.map((platform) => {
        return {
          label: platform.name,
          value: platform.uuid,
        };
      })
    : [];
  const featureData = Array.isArray(feature)
    ? feature.map((feature) => {
        return {
          label: feature.name,
          value: feature.uuid,
        };
      })
    : [];

  return (
    <>
      <TitleAndMetaTags
        title={`Create new game`}
        description={game.description}
        image={game.featuredImage}
      />
      <Container my={20} size={'sm'}>
        <Paper p={20} withBorder shadow={'xs'}>
          <Title order={2}>Create New Game</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput my="sm" required label="Game Name" placeholder="" {...register('name')} />
            <Textarea
              my="sm"
              required
              label="Game Summary"
              placeholder=""
              {...register('summary')}
            />
            <TextInput
              my="sm"
              required
              label="Website URL"
              placeholder=""
              {...register('website')}
            />
            <Controller
              name="genre"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  my={'sm'}
                  data={genreData}
                  searchable
                  label="Game Genre"
                  placeholder="Adventure, action, etc."
                  clearButtonLabel="Clear selection"
                  clearable
                  multiple
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  my={'sm'}
                  data={platformData}
                  label="Supported Platforms"
                  placeholder="Playstation, Xbox, etc."
                  clearButtonLabel="Clear selection"
                  clearable
                  searchable
                  multiple
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="featuredImage"
              control={control}
              render={({ field }) => (
                <DropZone title={'Featured Image'} multiple={false} required {...field} />
              )}
            />
            <Text my="xs">{'About this game'}</Text>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  {...field}
                  sticky={true}
                  stickyOffset={60}
                  onImageUpload={handleImageUpload}
                />
              )}
            />
            <Controller
              name="feature"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  my={'sm'}
                  data={featureData}
                  label="Supported Features"
                  placeholder="Singleplayer, Multiplayer, etc."
                  clearButtonLabel="Clear selection"
                  clearable
                  multiple
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="media"
              control={control}
              render={({ field }) => (
                <DropZone
                  accept={[IMAGE_MIME_TYPE, MIME_TYPES.mp4]}
                  title={'Other Media'}
                  multiple
                  required={false}
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
              Create Game
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    let user;
    try {
      user = await getUser(ctx);
    } catch (e) {
      console.error(e);
      user = null;
    }

    if (!user.user) {
      return {
        props: {
          redirect: {
            pathname: '/login',
          },
        },
      };
    }

    const { data: developer } = await supabaseServerClient(ctx)
      .from('developer')
      .select('*, developer_game(game(*))')
      .eq('profile_owner', user.user.id)
      .single();

    const { data: genre } = await supabaseServerClient(ctx).from('genre').select('*');
    const { data: platform } = await supabaseServerClient(ctx).from('platform').select('*');
    const { data: feature } = await supabaseServerClient(ctx).from('feature').select('*');
    return {
      props: {
        developer,
        genre,
        platform,
        feature,
      },
    };
  },
});
