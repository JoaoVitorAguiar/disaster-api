import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { categoriesRepositoryProvider } from './repositories/categories-repository.repository';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, categoriesRepositoryProvider],
})
export class CategoriesModule {}
