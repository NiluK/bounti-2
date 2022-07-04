import { createSlice, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    type: 'player',
  },
  reducers: {
    hi: (state) => {
      return state;
    },

    // setProfileType: (state, action) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes

    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
  extraReducers(builder) {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(fetchProfileType.fulfilled, (state, action) => {
      state.type = action.payload.type;
    });
    builder.addCase(setProfileType.fulfilled, (state, action) => {
      state.type = action.payload.data.type;
    });
  },
});

export const getProfileType = (state) => state.profile.type;
export const getProfile = (state) => state.profile.data;

type User = {
  id: string;
};

export const fetchProfileType = createAsyncThunk(
  'posts/fetchProfileType',
  async ({ user }: { user: User }) => {
    const { data } = await supabaseClient
      .from('profile_type')
      .select('*')
      .eq('user_uuid', user.id)
      .single();
    return data;
  }
);

export const fetchProfile = createAsyncThunk(
  'posts/fetchProfile',
  async ({ user, profile }: { user: User; profile: string }) => {
    const { data } = await supabaseClient
      .from(profile)
      .select('*')
      .eq('user_uuid', user.id)
      .single();
    return data;
  }
);

export const setProfileType = createAsyncThunk(
  'posts/setProfileType',
  async ({ type, user }: { user: User; type: string }) => {
    const data = await supabaseClient
      .from('profile_type')
      .update({ type })
      .match({ user_uuid: user.id })
      .single();
    return data;
  }
);

export const { hi } = profileSlice.actions;

export default profileSlice.reducer;
