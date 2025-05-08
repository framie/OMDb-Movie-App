import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Image, Text, Button, Loader, Stack, Group, Grid, rem, Alert } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addToList, removeFromList } from '../store/moviesSlice';
import { toggleFavourite } from '../store/favouritesSlice';
import axios from 'axios';
import type { Movie } from '../types';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { IconAlertCircle } from '@tabler/icons-react';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites.ids);
  const savedList = useSelector((state: RootState) => state.movies.savedList);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const url = `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&i=${movieId}&plot=full`;
        const response = await axios.get(url);
        if (response.data.Response === 'False') {
          setError(response.data.Error || 'Movie not found.');
          setMovie(null);
        } else {
          setMovie(response.data);
        }
      } catch (err) {
        console.error('Error loading movie:', err);
        setError('An unexpected error occurred while fetching the movie.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      document.title = movie.Title;
    } else if (error) {
      document.title = 'Movie Not Found';
    }
    return () => {
      document.title = 'Home';
    };
  }, [movie, error]);

  if (loading) {
    return (
      <Group justify="center" mt="xl">
        <Loader variant="dots" />
      </Group>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Alert icon={<IconAlertCircle size={20} />} title="Error" color="red" mb="lg">
          {error}
        </Alert>
        <Button onClick={() => navigate('/')}>← Back to Home</Button>
      </Container>
    );
  }

  if (!movie) return null;

  const isFavourited = favourites.includes(movie.imdbID);
  const isInList = savedList.some((m) => m.imdbID === movie.imdbID);

  return (
    <Container size="lg" py="xl">
      <Button variant="outline" onClick={() => navigate('/')} mb="lg">
        ← Back to Home
      </Button>
      <Card withBorder padding="lg" radius="md" shadow="sm">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Image
              src={movie.Poster !== 'N/A' ? movie.Poster : '/fallback.jpg'}
              alt={movie.Title}
              radius="md"
              fit="cover"
              height={rem(400)}
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = '/fallback.jpg';
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 8 }}>
            <Group justify="space-between">
              <Text fw={700} size="2xl">{movie.Title}</Text>
              <Button variant="subtle" onClick={() => dispatch(toggleFavourite(movie.imdbID))}>
                {isFavourited ? <IconStarFilled color="gold" size={24} /> : <IconStar size={24} />}
              </Button>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">{movie.Year} • {movie.Genre} • {movie.Runtime}</Text>
            <Text mt="md" size="md">{movie.Plot}</Text>
            <Stack mt="md">
              <Text size="sm"><strong>Director:</strong> {movie.Director}</Text>
              <Text size="sm"><strong>Writer:</strong> {movie.Writer}</Text>
              <Text size="sm"><strong>Actors:</strong> {movie.Actors}</Text>
              <Text size="sm"><strong>IMDB Rating:</strong> ⭐ {movie.imdbRating}</Text>
            </Stack>
            <Stack mt="xl">
              <Button 
                color={isInList ? "red" : "blue"}
                onClick={() => dispatch(isInList ? removeFromList(movie.imdbID) : addToList(movie))}
              >
                {isInList ? 'Remove from List' : 'Add to List'}
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
