import { Module } from '@nestjs/common';
import { CreditorsController } from './creditors.controller';
import { CreditorsService } from './creditors.service';
import { SendOrderWorkerHost } from '../common/utils/sendOrder_worker.host';

@Module({
 
  controllers: [CreditorsController],
  providers: [CreditorsService,SendOrderWorkerHost],
})
export class CreditorsModule {}