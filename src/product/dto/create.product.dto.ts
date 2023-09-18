import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

class Category {
  @IsNumber()
  id: number;
}

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

  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];
}
