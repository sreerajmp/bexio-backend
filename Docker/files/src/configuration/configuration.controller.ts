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
  @Post('getContactList')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getContactList(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getContactList(req,res);
  }
  @Post('getInvitionCodeDetails')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getInvitionCodeDetails(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getInvitionCodeDetails(req,res);
  }
  @Post('inviteCompany')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async inviteCompany(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.inviteCompany(req,res);
  }
  @Post('getBillerDetails')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getBillerDetails(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getBillerDetails(req,res);
  }
  @Post('getBiller')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getBiller(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getBiller(req,res);
  }
  @Post('getSectors')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async getSectors(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.getSectors(req,res);
  }
  @Post('updateBiller')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async updateBiller(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.updateBiller(req,res);
  }
  @Post('checkContact')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async checkContact(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.checkContact(req,res);
  }
  @Post('checkContactExist')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async checkContactExist(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.checkContactExist(req,res);
  }
  @Post('createContact')
  @UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
  async createContact(@Req() req: Request, @Res() res: Response): Promise<any> {
  // console.log('Received body:', req);
  return this.configurationService.createContact(req,res);
  }
  
}