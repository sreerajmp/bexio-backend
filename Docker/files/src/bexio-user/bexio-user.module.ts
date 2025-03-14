import { Module } from '@nestjs/common';
import { BexioUserController } from './bexio-user.controller';
import { BexioUserService } from './bexio-user.service';

@Module({
 
  controllers: [BexioUserController],
  providers: [BexioUserService],
})
export class BexioUserModule {}