import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToListDto {
  @IsNotEmpty()
  @IsNumber()
  movieId: number;
}
