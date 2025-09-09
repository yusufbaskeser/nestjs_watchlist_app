import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { movieList } from '../entities/movie.list.entity';
import { config } from '../config/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  validateMoviesList,
  validateMovieIncludeList,
  validateResponse,
  validateMovieExists,
} from './movies.validations/movies.validations';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(movieList)
    private movieRepository: Repository<movieList>,
  ) {}

  async searchPopularMovies() {
    const response = await fetch(
      `${process.env.BASE_URL}/movie/popular?api_key=${process.env.API_KEY}&language=tr-TR&page=1`,
    );
    validateResponse(response);
    const data = await response.json();
    return data.results;
  }

  async searchSoonMovies(){
    
    const response = await fetch(
      `${process.env.BASE_URL}/movie/upcoming?api_key=${process.env.API_KEY}&language=tr-TR&page=1`,
    );
    validateResponse(response);
    const data = await response.json();
    return data.results;

  }

  async searchTrendingMovies() {
    const response = await fetch(
      `${process.env.BASE_URL}/trending/movie/week?api_key=${process.env.API_KEY}&language=tr-TR`,
    );
    validateResponse(response);
    const data = await response.json();
    return data.results;
  }

  async searchTopRatedMovies() {
    const response = await fetch(
      `${process.env.BASE_URL}/movie/top_rated?api_key=${process.env.API_KEY}&language=tr-TR&page=1`,
    );
    validateResponse(response);
    const data = await response.json();
    return data.results;
  }

  async searchMovieByName(movieName: string) {
    const response = await fetch(
      `${process.env.BASE_URL}/search/movie?api_key=${process.env.API_KEY}&query=${encodeURIComponent(movieName)}&language=tr-TR&page=1`,
    );

    validateResponse(response);

    const data = await response.json();
    return data.results;
  }

  async getPublicLists() {
    return this.movieRepository.find({ where: { isPublic: true } });
  }

  async getUserFavorites(userEmail: string) {
    return this.movieRepository.find({
      where: { userEmail },
    });
  }

  async createMovieList(userEmail: string, listName: string, isPublic = false) {
    const newList = this.movieRepository.create({
      userEmail,
      listName,
      movies: [],
      isPublic,
    });
    return this.movieRepository.save(newList);
  }

  async addMovieToList(listId: number, movieId: number) {
    const list = await this.movieRepository.findOne({ where: { listId } });
    validateMoviesList(list);

    const res = await fetch(
      `${process.env.BASE_URL}/movie/${movieId}?api_key=${process.env.API_KEY}&language=tr-TR`,
    );
    const movie = await res.json();

    validateMovieExists(movie);
    validateMovieIncludeList(list, movie.id);

    list.movies.push(movie.id);
    return this.movieRepository.save(list);
  }


  async changeList(listId:number,listName:string,isPublic:boolean){
    const list = await this.movieRepository.findOne({where : { listId}});
    validateMoviesList(list);
    list.listName = listName;
    list.isPublic = isPublic;
    return this.movieRepository.save(list);

  }


  async deleteList(listId : number ){
    const list = await this.movieRepository.findOne({where : {listId}});
    validateMoviesList(list);
 
    await this.movieRepository.delete({listId});
    return {message : 'list deleted successfully'}
  }


  async removeMovieFromList(listId : number, movieId : number){
    const list = await this.movieRepository.findOne({where: {listId}});
    validateMoviesList(list);
    validateMovieIncludeList(list,movieId);
    list.movies = list.movies.filter(id => id !== movieId);
    return this.movieRepository.save(list);

  }
}
