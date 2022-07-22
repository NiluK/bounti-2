import React, { useState, useEffect, useContext } from 'react';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MainHero } from '@components/marketing/MainHero';
import { BenefitsSection } from '@components/marketing/BenefitsSection';
import { getUser, supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { Container } from '@mantine/core';

const fetchGames = async () => {
  const { data, error } = await supabaseClient.from('game').select('*');
  return data;
};

export default function Home(props) {
  const [games, setGames] = useState(props.games || []);

  useEffect(() => {
    if (!games.length) {
      const fetchedGame = fetchGames();
      setGames(fetchedGame);
    }
  }, [games]);

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
  try {
    const { data, error } = await supabaseServerClient(ctx).from('game').select('*');
    let user = null;
    user = await getUser(ctx);

    return {
      props: {
        games: data,
        user: user.user,
      },
    };
  } catch (error) {
    if (error.message?.includes('JWT expired')) {
      await supabaseServerClient(ctx).auth.refreshSession();
    } else {
      return {
        props: {
          games: [],
          user: null,
        },
      };
    }
  }
}
