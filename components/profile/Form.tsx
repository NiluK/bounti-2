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

export default function Form() {
  const { register, handleSubmit, watch, control } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    // try {
    //   setLoading(true);

    //   const { data: game } = await supabaseClient
    //     .from('game')
    //     .insert({
    //       name: data.name,
    //       description: data.description,
    //       slug: camelCase(data.name),
    //       website: data.website,
    //     })
    //     .single();

    //   for (const genre in data.genre) {
    //     const { data: game_genre } = await supabaseClient
    //       .from('game_genre')
    //       .insert({
    //         genre_uuid: data.genre[genre],
    //         game_uuid: game.uuid,
    //       })
    //       .single();
    //   }

    //   for (const feature in data.feature) {
    //     const { data: feature_game } = await supabaseClient
    //       .from('feature_game')
    //       .insert({
    //         feature_uuid: data.feature[feature],
    //         game_uuid: game.uuid,
    //       })
    //       .single();
    //   }

    //   for (const platform in data.platform) {
    //     const { data: game_platform } = await supabaseClient
    //       .from('game_platform')
    //       .insert({
    //         platform_uuid: data.platform[platform],
    //         game_uuid: game.uuid,
    //       })
    //       .single();
    //   }

    //   const mediaUrls = [];

    //   for (const media in data.media) {
    //     const { data: mediaData } = await supabaseClient.storage
    //       .from('games')
    //       .upload(`${game.uuid}/media/${data.media[media].path}`, data.media[media], {
    //         upsert: true,
    //       });
    //     mediaUrls.push(
    //       `https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${mediaData.Key}`
    //     );
    //   }

    //   const featuredImage = await supabaseClient.storage
    //     .from('games')
    //     .upload(`${game.uuid}/featured-image/${data.featuredImage.path}`, data.featuredImage, {
    //       upsert: true,
    //     });

    //   const { data: updatedDeveloper } = await supabaseClient
    //     .from('developer_game')
    //     .insert({
    //       developer_uuid: developer.uuid,
    //       game_uuid: game.uuid,
    //     })
    //     .match({ uuid: developer })
    //     .single();

    //   const { data: updatedGame } = await supabaseClient
    //     .from('game')
    //     .update({
    //       featured_image: `https://ujsgjkwpigmmnmyfdgnb.supabase.co/storage/v1/object/public/${featuredImage.data.Key}`,
    //       media: mediaUrls,
    //     })
    //     .match({ uuid: game.uuid })
    //     .single();

    //   setLoading(false);

    //   router.push(`/games/${updatedGame.slug}`);
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }
  };

  return (
    <>
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
            >
              Create Profile
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
