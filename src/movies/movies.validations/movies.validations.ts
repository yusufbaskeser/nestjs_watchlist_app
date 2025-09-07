import { NotFoundException } from '@nestjs/common';

export function validateResponse(response: any) {
    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }
  }

export function validateMoviesList(list: any): asserts list {
    if (!list) throw new NotFoundException('List not found');
  }
  
  export function validateMovieIncludeList(list: any, movieName: string) {
    if (list.movies.includes(movieName)) {
      throw new Error('Movie already in the list');
    }
  }
  
  export function validateMovieFound(movieData: any) {
    if (!movieData || movieData.results.length === 0) {
      throw new Error('Movie not found in TMDB');
    }
  }