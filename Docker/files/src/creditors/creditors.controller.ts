import { Controller, Post, Body, UseInterceptors, Get, Req, Res, Param, Query, All, UseGuards } from '@nestjs/common';
import { CreditorsService } from './creditors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';
import { ApiBody } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/common/guards/cookie-auth.guard';

@UseGuards(CookieAuthGuard)
@Controller('creditors')
export class CreditorsController {
  constructor(private readonly creditorsService: CreditorsService) {

  }
  @Post('getInvoice')
  @UseInterceptors(AnyFilesInterceptor())
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {

    return this.creditorsService.getInvoice(req, res);
  }

  @UseInterceptors(RedisCacheInterceptor)
  @Post('getOrderList')
  @UseInterceptors(AnyFilesInterceptor())
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.creditorsService.getOrderList(req, res);
  }
  @Post('sendOrder')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async sendOrder(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.creditorsService.sendOrder(req, res);
  }
  @Post('xmlToJson')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async xmlToJson(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.creditorsService.xmlToJson(req, res);
  }
  @Post('getAllUsers')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getAllUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.creditorsService.getAllUsers(req, res);
  }
  // @All('getG2b/:path')
  // @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  // async passTog2b(@Req() req: Request, @Res() res: Response,@Param('path') path: string): Promise<any> {
  // return this.creditorsService.passTog2b(req,res,'POST',path);
  // }
  @All('getG2b/*')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async passTog2bGet(@Req() req: Request, @Res() res: Response, @Param('path') path: string, @Param('id') id: string): Promise<any> {
    let pathValue = Array.isArray(path) ? (path.length > 1 ? path.join('/') : path[0]) : path;
    console.log("path", path);
    console.log("id", id);
    console.log("pathValue", pathValue);
    console.log("HTTP Method:", req.method);

    return this.creditorsService.passTog2b(req, res, req.method, pathValue);
  }

  @Post('emailSendingScheduler')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  @ApiBody({
    description: "Email scheduler details",
    schema: {
      type: "object",
      properties: {
        startDate: { type: 'string', nullable: true },
        endDate: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true }
      }
    }
  })
  async emailSendingScheduler(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any
  ): Promise<any> {
    return this.creditorsService.emailSendingScheduler(req, res);
  }

  @All('gate2bApi/*')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async byPassApi(@Req() req: Request, @Res() res: Response, @Param('path') path: string, @Param('id') id: string): Promise<any> {
    let pathValue = (path.length > 1 ? path[0] + '/' + path[1] : path[0]);
    console.log("path", path);
    console.log("id", id);
    console.log("pathValue", pathValue);
    console.log("HTTP Method:", req.method);

    return this.creditorsService.byPassApi(req, res, req.method, pathValue);
  }
}
