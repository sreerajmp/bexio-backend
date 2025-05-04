import { Controller,Post,UseInterceptors,Req,Res } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';
import { PushWorkerHost } from 'src/common/utils/push.worker.host';

@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService,
    private readonly pushWorkerHost: PushWorkerHost
  ) {
    
  }
  @UseInterceptors(RedisCacheInterceptor)
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log('controller getInvoice');
    return this.debtorsService.getInvoice(req, res);
  }

  @UseInterceptors(RedisCacheInterceptor)
  @Post('getOrderList')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getOrderList(req,res);
  }

  @UseInterceptors(RedisCacheInterceptor)
  @Post('getDeliveryNotesList')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getDeliveryNotesList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getDeliveryNotesList(req,res);
  }
  
  @Post('sendInvoice')
  @UseInterceptors(AnyFilesInterceptor()) 
  async sendInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.debtorsService.sendInvoice(req,res);
  }
  @Post('sendOrder')
  @UseInterceptors(AnyFilesInterceptor()) 
  async sendOrder(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.debtorsService.sendOrder(req,res);
  }
  @Post('sendDeliveryNotes')
  @UseInterceptors(AnyFilesInterceptor()) 
  async sendDeliveryNotes(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.debtorsService.sendDeliveryNotes(req,res);
  }
  
}
