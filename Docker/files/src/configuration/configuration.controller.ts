import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
@Controller('Configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {
    
  }
  @Post('getPayementComments')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getPayementComments(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.configurationService.getPayementComments(req,res);
  }
}