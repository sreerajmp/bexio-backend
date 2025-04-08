import { Controller,Post,UseInterceptors,Req,Res } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';

@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {
    
  }
  @UseInterceptors(RedisCacheInterceptor)
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log('controller getInvoice');
    return this.debtorsService.getInvoice(req, res);
  }

  // @UseInterceptors(RedisCacheInterceptor)
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
  @Post('getTagName')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getTagName(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.debtorsService.getTagName(req,res);
  }
}
