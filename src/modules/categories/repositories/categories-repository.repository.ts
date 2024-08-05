import { Provider } from '@nestjs/common';
import { ICategoriesRepository } from './categories-repository.abstract';
import { CategoriesRepository } from './implementations/categories.repository';

export const categoriesRepositoryProvider: Provider = {
  provide: ICategoriesRepository,
  useClass: CategoriesRepository,
};
