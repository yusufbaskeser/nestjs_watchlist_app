import { Controller, Get, Post, Body, Param, Req, Put, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import type { Requestt } from '../middleware/tokenCheck';
import { CreateListDto } from './dto/createListDto';
import { AddToListDto } from './dto/addToListDto';
import { SearchMovieDto } from './dto/searchMovieDto';

@Controller('movies')
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  @Get('searchPopular')
  async searchPopularMovies() {
    return this.movieService.searchPopularMovies();
  }

  @Get('searchSoonMovies')
  async searchSoonMovies() {
    return this.movieService.searchSoonMovies();
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
  async searchMovie(@Param() params: SearchMovieDto) {
    return this.movieService.searchMovieByName(params.name);
  }

  @Get('publicLists')
  async getPublicLists() {
    return this.movieService.getPublicLists();
  }

  @Get('userFavorites')
  async getUserFavorites(@Req() req: Requestt) {
    const { user } = req;
    return this.movieService.getUserFavorites(user.email);
  }

  @Post('createList')
  async createList(@Body() body: CreateListDto, @Req() req: Requestt) {
    const { user } = req;
    return this.movieService.createMovieList(
      user.email,
      body.listName,
      body.isPublic,
    );
  }


  


  @Post('addToList/:listId')
  async addToList(@Param('listId') listId: number, @Body() body: AddToListDto) {
    return this.movieService.addMovieToList(listId, body.movieId);
  }

  @Delete('removeMovieFromList/:listId/:movieId')
  async removeMovieFromList(@Param('listId') listId : number , @Param('movieId')movieId : number){
    return this.movieService.removeMovieFromList(listId,movieId);
  }


  @Put('changeList/:listId')
  async changeList(@Param('listId') listId : number ,  @Body()body : CreateListDto){
    return this.movieService.changeList(listId,body.listName,body.isPublic ?? false)
  } 


  @Delete('deleteList/:listId')
  async deleteList(@Param('listId') listId : number){
    return this.movieService.deleteList(listId)
  }


}
