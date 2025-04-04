import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {
    
  }
  @Post('getPayementComments')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getPayementComments(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.configurationService.getPayementComments(req,res);
  }
  @Post('setConfiguration')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async setConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.setConfiguration(req,res);
  }
  @Post('updateConfiguration')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async updateConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.updateConfiguration(req,res);
  }
  @Post('getConfiguration')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getConfiguration(req,res);
  }
  @Post('getediConfig')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getediConfig(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getediConfig(req,res);
  }
  
}