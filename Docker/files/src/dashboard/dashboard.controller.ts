import { Controller,Post,UseInterceptors,Req,Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService    
  ) {
    
  }
  // @UseInterceptors(RedisCacheInterceptor)
  @Post('getTransactionList')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getTransactionList(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log('controller getTransactionList');
    return this.dashboardService.getTransactionList(req, res);
  }
  @Post('getplanData')
  @UseInterceptors(AnyFilesInterceptor()) 
  async getplanData(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log('controller getTransactionList');
    return this.dashboardService.getplanData(req, res);
  }
  
}
