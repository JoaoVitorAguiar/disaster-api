import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categoriesDTO';

export abstract class ICategoriesRepository {
  abstract create(data: CreateCategoryDto): Promise<Category>;
  abstract findAll(): Promise<Category[]>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract findById(id: string): Promise<Category | null>;
  abstract update(id: string, data: UpdateCategoryDto): Promise<Category>;
  abstract delete(id: string): Promise<void>;
}
