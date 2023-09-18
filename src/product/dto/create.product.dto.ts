import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

abstract class ICategory {
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
  @Type(() => ICategory)
  categories?: ICategory[];

  images?: string[];
}
