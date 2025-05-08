import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FavouritesState {
  ids: string[];
}

const loadFromLocalStorage = (): string[] => {
  const stored = localStorage.getItem('Favourites');
  return stored ? JSON.parse(stored) : [];
};

const saveToLocalStorage = (ids: string[]) => {
  localStorage.setItem('Favourites', JSON.stringify(ids));
};

const initialState: FavouritesState = {
  ids: loadFromLocalStorage(),
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((existingId) => existingId !== id);
      } else {
        state.ids.push(id);
      }
      saveToLocalStorage(state.ids);
    },
  },
});

export const { toggleFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
