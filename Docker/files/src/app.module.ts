import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BexioUserModule } from './bexio-user/bexio-user.module';
import { DebtorsModule } from './debtors/debtors.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // PrismaModule
    BexioUserModule,
    DebtorsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
