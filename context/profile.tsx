import { createContext, useState, useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

export const ProfileContext = createContext({
  profile: null,
  profileType: 'player',
  setProfileType: (data) => {},
});

export const ProfileProvider = (props) => {
  const setProfileType = (profileType) => {
    console.log('profileType', profileType);
    setState({ ...state, profileType: profileType });
  };

  const initState = {
    profile: null,
    profileType: 'player',
    setProfileType: setProfileType,
  };

  const [state, setState] = useState(initState);

  // useEffect(() => {
  //   async function fetchProfile() {
  //     const { data } = await supabaseClient.from('player').select('*').single();
  //     setState({ ...state, profile: data });
  //   }
  //   fetchProfile();
  // }
  // , []);

  return <ProfileContext.Provider value={state}>{props.children}</ProfileContext.Provider>;
};
