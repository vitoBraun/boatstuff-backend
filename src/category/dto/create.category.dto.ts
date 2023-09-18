// import { Prisma } from '@prisma/client';

import { IsString } from 'class-validator';

class ICategory {
  id: number;
}

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  level?: number;

  // successors?: Prisma.CategorySubcategoryCreateNestedManyWithoutPredecessorInput;
  predecessors?: ICategory[];
}
