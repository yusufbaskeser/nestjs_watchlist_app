import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  listName: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
