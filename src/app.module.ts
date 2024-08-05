import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/user.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { OccurencesModule } from '@modules/occurences/occurences.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CampaignsModule } from '@modules/campaigns/campaigns.module';
import { AddressesModule } from '@modules/addresses/address.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    CategoriesModule,
    OccurencesModule,
    AuthModule,
    CampaignsModule,
    AddressesModule
  ],
})
export class AppModule {}
