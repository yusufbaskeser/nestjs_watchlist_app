import { NotFoundException } from '@nestjs/common';

export function validateResponse(response: any) {
  if (!response.ok) {
    throw new Error('TMDB API request failed');
  }
}

export function validateMoviesList(list: any): asserts list {
  if (!list) throw new NotFoundException('List not found');
}

export function validateMovieIncludeList(list: any, movieId: number) {
  if (list.movies.includes(movieId)) {
    throw new Error('Movie already in the list');
  }
}



export function validateMovieExists(movie: any) {
  if (!movie || movie.success === false) {
    throw new Error('Movie not found in TMDB');
  }
}
