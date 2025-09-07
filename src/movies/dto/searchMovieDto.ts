import { IsNotEmpty, IsString } from 'class-validator';

export class SearchMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
