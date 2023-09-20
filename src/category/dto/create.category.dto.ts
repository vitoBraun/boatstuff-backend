import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateSubcategoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: number;
}
