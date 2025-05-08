import { useState } from 'react';
import {
  Container,
  SimpleGrid,
  Loader,
  Text,
  TextInput,
  Group,
  Button,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import MovieCard from '../components/MovieCard';
import { setSearchQuery, setSearchResults } from '../store/moviesSlice';
import type { RootState } from '../store';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function Home() {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, savedList } = useSelector(
    (state: RootState) => state.movies
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      setLoading(true);
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=${searchQuery}`;
      const response = await axios.get(url);
      setError('');
      if (response.data.Error) {
        setError(response.data.Error);
      }
      const data = {
        query: searchQuery,
        results: response.data.Search || [],
      };
      dispatch(setSearchResults(data || {}));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setError('');
    dispatch(setSearchQuery(''));
    dispatch(setSearchResults({}));
  };

  const moviesToDisplay = searchResults.query ? (searchResults.results || []) : savedList;

  const headerText = searchResults.query
    ? `${searchResults.results?.length === 0 ? 'No ' : ''}Search Results for "${searchResults.query}"`
    : `${savedList.length === 0 ? 'No ' : ''}Saved Movies`;

  return (
    <Container size='xl' py='xl'>
      <TextInput
        radius='xl'
        size='lg'
        placeholder='Enter movie title'
        rightSectionWidth={165}
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.currentTarget.value))}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <Button.Group>
            <Button onClick={handleSearch} radius='xl' size='sm'>
              Search
            </Button>
            <Button onClick={handleReset} radius='xl' color='red'>
              Reset
            </Button>
          </Button.Group>
        }
      />

      <Text mt='xl' size='xl' fw={600} mb='md' c={error ? 'red' : 'black'}>
        {error ? `Error: ${error}` : headerText}
      </Text>

      {loading ? (
        <Group justify='center' mt='xl'>
          <Loader variant='dots' />
        </Group>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 'md', sm: 'xl' }}
        >
          {moviesToDisplay.map((movie) => (
            <MovieCard movie={movie} key={movie.imdbID} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
