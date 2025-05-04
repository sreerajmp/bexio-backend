import { Module } from '@nestjs/common';
import { DebtorsController } from './debtors.controller';
import { DebtorsService } from './debtors.service';
import { PushWorkerHost } from 'src/common/utils/push.worker.host';
import { SendDeliveryNotesHost } from 'src/common/utils/sendDeliveryNotes.host';
@Module({
  controllers: [DebtorsController],
  providers: [DebtorsService, PushWorkerHost,SendDeliveryNotesHost],
  exports: [DebtorsService],
})
export class DebtorsModule {}