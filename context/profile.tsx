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

  console.log('props', state);

  console.log('state', state);

  return <ProfileContext.Provider value={state}>{props.children}</ProfileContext.Provider>;
};
