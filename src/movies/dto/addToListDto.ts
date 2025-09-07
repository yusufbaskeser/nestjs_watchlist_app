import { IsNotEmpty, IsString } from 'class-validator';


export class AddToListDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;
}