import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Movie } from '../types';

interface SearchResults {
  query?: string;
  results?: Movie[];
}

interface MoviesState {
  searchQuery: string;
  searchResults: SearchResults;
  savedList: Movie[];
}

const initialState: MoviesState = {
  searchQuery: '',
  searchResults: {},
  savedList: [],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<SearchResults>) => {
      state.searchResults = action.payload;
    },
    addToList: (state, action: PayloadAction<Movie>) => {
      const exists = state.savedList.some(
        (movie) => movie.imdbID === action.payload.imdbID
      );
      if (!exists) {
        state.savedList.push(action.payload);
      }
    },
    removeFromList: (state, action: PayloadAction<string>) => {
      state.savedList = state.savedList.filter(
        (movie) => movie.imdbID !== action.payload
      );
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  addToList,
  removeFromList,
} = moviesSlice.actions;

export default moviesSlice.reducer;
