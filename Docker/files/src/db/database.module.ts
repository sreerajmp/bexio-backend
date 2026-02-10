import { Global, Module } from '@nestjs/common';
import { PrismaClientsService } from './prisma-clients.service';

@Global()
@Module({
  providers: [PrismaClientsService],
  exports: [PrismaClientsService],
})
export class DatabaseModule {}
