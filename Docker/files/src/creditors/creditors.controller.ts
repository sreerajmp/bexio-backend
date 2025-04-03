import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { CreditorsService } from './creditors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
@Controller('creditors')
export class CreditorsController {
  constructor(private readonly creditorsService: CreditorsService) {
    
  }
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
 
  return this.creditorsService.getInvoice(req,res);
  }
  @Post('getOrderList')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.creditorsService.getOrderList(req,res);
  }
}
