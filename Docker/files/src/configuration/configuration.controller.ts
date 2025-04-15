import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {
    
  }
  @Post('getPayementComments')
  @UseInterceptors(AnyFilesInterceptor())
  async getPayementComments(@Req() req: Request, @Res() res: Response): Promise<any> {
  return this.configurationService.getPayementComments(req,res);
  }
  @Post('setConfiguration')
  @UseInterceptors(AnyFilesInterceptor())
  async setConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.setConfiguration(req,res);
  }
  @Post('updateConfiguration')
  @UseInterceptors(AnyFilesInterceptor())
  async updateConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.updateConfiguration(req,res);
  }
  @Post('getConfiguration')
  @UseInterceptors(AnyFilesInterceptor())
  async getConfiguration(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getConfiguration(req,res);
  }
  @Post('getediConfig')
  @UseInterceptors(AnyFilesInterceptor())
  async getediConfig(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getediConfig(req,res);
  }
  @Post('getContactList')
  @UseInterceptors(AnyFilesInterceptor())
  async getContactList(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getContactList(req,res);
  }
  @Post('getInvitionCodeDetails')
  @UseInterceptors(AnyFilesInterceptor())
  async getInvitionCodeDetails(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getInvitionCodeDetails(req,res);
  }
  @Post('inviteCompany')
  @UseInterceptors(AnyFilesInterceptor())
  async inviteCompany(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.inviteCompany(req,res);
  }
  @Post('getBillerDetails')
  @UseInterceptors(AnyFilesInterceptor())
  async getBillerDetails(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getBillerDetails(req,res);
  }
  @Post('getBiller')
  @UseInterceptors(AnyFilesInterceptor())
  async getBiller(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getBiller(req,res);
  }
  @Post('getSectors')
  @UseInterceptors(AnyFilesInterceptor())
  async getSectors(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.getSectors(req,res);
  }
  @Post('updateBiller')
  @UseInterceptors(AnyFilesInterceptor())
  async updateBiller(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.updateBiller(req,res);
  }
  @Post('checkContact')
  @UseInterceptors(AnyFilesInterceptor())
  async checkContact(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.checkContact(req,res);
  }
  @Post('checkContactExist')
  @UseInterceptors(AnyFilesInterceptor())
  async checkContactExist(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.checkContactExist(req,res);
  }
  @Post('createContact')
  @UseInterceptors(AnyFilesInterceptor())
  async createContact(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.createContact(req,res);
  }
  @Post('createBiller')
  @UseInterceptors(AnyFilesInterceptor())
  async createBiller(@Req() req: Request, @Res() res: Response): Promise<any> {
  
  return this.configurationService.createBiller(req,res);
  }
}