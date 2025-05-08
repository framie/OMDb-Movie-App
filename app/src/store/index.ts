import { configureStore } from '@reduxjs/toolkit';

import moviesReducer from './moviesSlice';
import favouritesReducer from './favouritesSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;