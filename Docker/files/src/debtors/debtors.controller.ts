import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {
    
  }

  // @Post('getInvoice')
  // async getInvoice(@Body() data: any, @Res() res: Response): Promise<any> {
  //   console.log('Received body:', data);
  //   return this.debtorsService.getInvoice(data, res);
  // }
 
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getInvoice(req,res);
  }
  @Post('getOrderList')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getOrderList(req,res);
  }
  @Post('getDeliveryNotesList')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getDeliveryNotesList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getDeliveryNotesList(req,res);
  }
}
