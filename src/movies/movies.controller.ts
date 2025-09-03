import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { MoviesService } from './movies.service';
import type { RequestWithUser } from '../middleware/tokenCheck';

@Controller('movies')
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  @Get('searchPopular')
  async searchPopularMovies() {
    return this.movieService.searchPopularMovies();
  }

  @Get('searchTrending')
  async searchTrendingMovies() {
    return this.movieService.searchTrendingMovies();
  }

  @Get('searchTopRated')
  async searchTopRatedMovies() {
    return this.movieService.searchTopRatedMovies();
  }

  @Get('search/:name')
  async searchMovie(@Param('name') name: string) {
    return this.movieService.searchMovieByName(name);
  }

  @Post('createList')
  async createList(
    @Body() body: { listName: string },
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.movieService.createMovieList(user.email, body.listName);
  }

  @Post('addToList/:listId')
  async addToList(
    @Param('listId') listId: number,
    @Body() body: { movieName: string },
  ) {
    return this.movieService.addMovieToList(listId, body.movieName);
  }
}
