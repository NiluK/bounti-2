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
  MultiSelect,
  Select,
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

export default function BountiNew(props) {
  const [category, setCategory] = useState(props.category);
  const [platform, setPlatform] = useState(props.platform);
  const [feature, setFeature] = useState(props.feature);
  const [developer, setDeveloper] = useState(props.developer);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  const { register, handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { data: bounti } = await supabaseClient
        .from('bounti')
        .insert({
          title: data.title,
          subtitle: data.subtitle,
          slug: camelCase(data.title),
          instructions: data.instructions,
          non_monetary_rewards: data.non_monetary_rewards,
          reward_distribution: data.reward_distribution,
          reward_deadline: data.reward_deadline,
          reward_number: data.reward_number,
          reward_value: data.reward_value,
          file: data.file,
          build: data.build,
        })
        .single();

      console.log('bounti', bounti);

      const featuredImage = await supabaseClient.storage
        .from('bounti')
        .upload(`${bounti.uuid}/featured-image/${data.featuredImage.path}`, data.featuredImage, {
          upsert: true,
        });

      const { data: bounti_category } = await supabaseClient
        .from('bounti_category')
        .insert({
          category_uuid: data.category,
          bounti_uuid: bounti.uuid,
        })
        .single();

      const { data: game } = await supabaseClient
        .from('bounti_game')
        .insert({
          game_uuid: data.game,
          bounti_uuid: bounti.uuid,
        })
        .single();

      for (const platform in data.platform) {
        const { data: game_platform } = await supabaseClient
          .from('bounti_platform')
          .insert({
            platform_uuid: data.platform[platform],
            bounti_uuid: bounti.uuid,
          })
          .single();
      }

      const { data: updatedDeveloper } = await supabaseClient
        .from('bounti_developer')
        .insert({
          developer_uuid: developer.uuid,
          bounti_uuid: bounti.uuid,
        })
        .match({ uuid: developer })
        .single();

      const { data: updatedBounti } = await supabaseClient
        .from('bounti')
        .update({
          featured_image: `https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${featuredImage.data.Key}`,
        })
        .match({ uuid: bounti.uuid })
        .single();

      setLoading(false);

      router.push(`/bounties/${updatedBounti.slug}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const games = developer?.developer_game;

  console.log('games', games);

  useEffect(() => {
    if (!category.length) {
      const category = getData('category');
      setCategory(category);
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
  }, [category, platform, feature, developer]);

  const categoryData = Array.isArray(category)
    ? category.map((category) => {
        return {
          label: category.name,
          value: category.uuid,
        };
      })
    : [];
  const [categorySetData, setCategorySetData] = useState(categoryData);

  const platformData = Array.isArray(platform)
    ? platform.map((platform) => {
        return {
          label: platform.name,
          value: platform.uuid,
        };
      })
    : [];

  const gamesData = Array.isArray(games)
    ? games.map(({ game }) => {
        return {
          label: game.name,
          value: game.uuid,
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
      <TitleAndMetaTags title={`Create new bounti`} />
      <Container my={20} size={'sm'}>
        <Paper p={20} withBorder shadow={'xs'}>
          <Title order={2}>Create New Bounti</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput my="sm" required label="Bounti Name" placeholder="" {...register('title')} />
            <Textarea
              my="sm"
              required
              label="Bounti Description"
              placeholder=""
              {...register('subtitle')}
            />
            <Controller
              name="featuredImage"
              control={control}
              render={({ field }) => (
                <DropZone title={'Featured Image'} multiple={false} required {...field} />
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  my={'sm'}
                  data={categorySetData}
                  searchable
                  label="Bounti Category"
                  placeholder="QA, Marketing, etc."
                  clearButtonLabel="Clear selection"
                  clearable
                  multiple
                  getCreateLabel={(query) => `+ Create ${query}`}
                  creatable
                  required
                  onCreate={(query) => setCategorySetData((current) => [...current, query])}
                  {...field}
                />
              )}
            />

            <TextInput
              my="sm"
              required
              type="number"
              label="Build Version"
              placeholder=""
              {...register('build')}
              step={0.01}
              min={0}
            />

            <TextInput my="sm" required label="File Link" placeholder="" {...register('file')} />

            <Controller
              name="game"
              control={control}
              render={({ field }) => (
                <Select
                  my={'sm'}
                  data={gamesData}
                  searchable
                  label="Associated Game"
                  placeholder="Adventure, action, etc."
                  clearButtonLabel="Clear selection"
                  clearable
                  multiple
                  required
                  {...field}
                />
              )}
            />

            <TextInput
              type="number"
              my="sm"
              required
              label="Bounti Reward (AUD)"
              min={0}
              placeholder=""
              {...register('reward_value')}
            />

            <TextInput
              type="number"
              my="sm"
              min={1}
              required
              label="Total Number of Prizes"
              placeholder=""
              {...register('reward_number')}
            />

            <Textarea
              my="sm"
              label="How will rewards be distributed?"
              required
              placeholder=""
              {...register('reward_distribution')}
            />

            <Textarea
              my="sm"
              label="Non Monetary Rewards"
              placeholder=""
              {...register('non_monetary_rewards')}
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
            <Text my="xs">{'Instructions *'}</Text>
            <Controller
              name="instructions"
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

            <Checkbox
              my="lg"
              label="This bounti requires an NDA to be signed"
              {...register('requires_nda')}
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
              Create Bounti
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
      .eq('user_uuid', user.user.id)
      .single();

    const { data: category } = await supabaseServerClient(ctx).from('category').select('*');
    const { data: platform } = await supabaseServerClient(ctx).from('platform').select('*');
    const { data: feature } = await supabaseServerClient(ctx).from('feature').select('*');

    return {
      props: {
        developer,
        category,
        platform,
        feature,
      },
    };
  },
});
