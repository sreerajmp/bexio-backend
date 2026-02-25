import { Controller, Post, UseInterceptors, Req, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { CookieAuthGuard } from 'src/common/guards/cookie-auth.guard';

@UseGuards(CookieAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService
  ) {

  }
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
