import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { CreditorsService } from './creditors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';
@Controller('creditors')
export class CreditorsController {
  constructor(private readonly creditorsService: CreditorsService) {
    
  }
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor())
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
 
  return this.creditorsService.getInvoice(req,res);
  }
  
  @UseInterceptors(RedisCacheInterceptor)
  @Post('getOrderList')
  @UseInterceptors(AnyFilesInterceptor())
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.creditorsService.getOrderList(req,res);
  }
  @Post('sendOrder')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async sendOrder(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.creditorsService.sendOrder(req,res);
  }
  @Post('xmlToJson')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async xmlToJson(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.creditorsService.xmlToJson(req,res);
  }
  @Post('getAllUsers')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getAllUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.creditorsService.getAllUsers(req,res);
  }
  @Post('getG2b/:path')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async passTog2b(@Req() req: Request, @Res() res: Response,@Param('path') path: string): Promise<any> {
  return this.creditorsService.passTog2b(req,res,'POST',path);
  }
  @Get('getG2b/:path')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async passTog2bGet(@Req() req: Request, @Res() res: Response,@Param('path') path: string): Promise<any> {
  return this.creditorsService.passTog2b(req,res,'GET',path);
  }
  
}
