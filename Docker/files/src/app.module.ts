import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BexioUserModule } from './bexio-user/bexio-user.module';
import { DebtorsModule } from './debtors/debtors.module';
import { CreditorsModule } from './creditors/creditors.module';
import { ConfigurationModule } from './configuration/configuration.module';
import {DashboardModule} from './dashboard/dashboard.module'
import { ContactImportModule } from './contact-import/contact-import.module';
import { DatabaseModule } from './db/database.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // PrismaModule
    DatabaseModule,
    BexioUserModule,
    DebtorsModule,
    CreditorsModule,
    ConfigurationModule,
    DashboardModule,
    ContactImportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
