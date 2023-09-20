import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  shortDescription: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isNew: boolean;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  subcategoryId?: number;

  images?: string;
}
