import { configureStore, combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import profileReducer from './profile/profileSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  profile: profileReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
