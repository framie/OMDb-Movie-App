import { AspectRatio, Button, Card, Group, Image, Text, rem } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../store';
import type { Movie } from '../types';
import { addToList, removeFromList } from '../store/moviesSlice';
import { toggleFavourite } from '../store/favouritesSlice';

import classes from './MovieCard.module.css';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const dispatch = useDispatch();
  const savedList = useSelector((state: RootState) => state.movies.savedList);
  const favourites = useSelector((state: RootState) => state.favourites.ids);

  const isInList = savedList.some((m) => m.imdbID === movie.imdbID);
  const isFavourited = favourites.includes(movie.imdbID);

  const handleListAction = () => {
    if (isInList) {
      dispatch(removeFromList(movie.imdbID));
    } else {
      dispatch(addToList(movie));
    }
  };

  return (
    <Card p="md" radius="md" className={classes.card}>
      <Card.Section>
        <AspectRatio ratio={3 / 4}>
          <Image
            src={movie.Poster !== 'N/A' ? movie.Poster : '/fallback.jpg'}
            alt={movie.Title}
            fit="cover"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              target.src = '/fallback.jpg';
            }}
          />
        </AspectRatio>
      </Card.Section>

      <Text fw={500} size="lg" lineClamp={1} mt="sm">
        {movie.Title}
      </Text>
      <Text size="sm" c="dimmed" mb="xs">
        {movie.Year}
      </Text>

      <Group gap="6">
        <Link to={`/movies/${movie.imdbID}`}>
          <Button variant="outline" radius='xl'>View Details</Button>
        </Link>
        
        <Button onClick={handleListAction} radius='xl' color={isInList ? 'red' : 'blue'}>
          {isInList ? 'Remove from List' : 'Add to List'}
        </Button>

        <Button
          variant="subtle"
          px="4"
          ml="auto"
          onClick={() => dispatch(toggleFavourite(movie.imdbID))}
        >
          {isFavourited ? <IconStarFilled color="gold" /> : <IconStar />}
        </Button>
      </Group>
    </Card>
  );
}
