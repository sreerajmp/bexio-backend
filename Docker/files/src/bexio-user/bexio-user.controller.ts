import { Controller, Post, Body, Req, Res, UseInterceptors, Query, Get } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BexioUserService } from './bexio-user.service';
import { Request, Response } from 'express';

@Controller('bexio-user')
export class BexioUserController {
    constructor(private readonly bexioUserService: BexioUserService) {
    
  }

  @Get('bexio-redirect') // Matches /bexio-redirect with optional ?code= param
  async bexioRedirect(
    @Query('code') code: string, // Extracts code from the query string
    @Req() req: Request, 
    @Res() res: Response
  ): Promise<any> {
    console.log('Received Code:', code || 'No code provided');

    return this.bexioUserService.bexioRedirect(req, res);
  }


@Post('authorization')
@UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
async authorization (@Body() data: any): Promise<any> {
console.log('Received body:', data);
return this.bexioUserService.authorization (data);
}

@Post('set-expire-cookie')
@UseInterceptors(AnyFilesInterceptor())
async setExpireCookie(
  @Req() req: Request,
  @Res() res: Response
): Promise<any> {
  // console.log('Received body:', req);
  return this.bexioUserService.setExpireCookie(req, res);
}
@Post('get-token')
@UseInterceptors(AnyFilesInterceptor())
async getToken(
    @Req() req: Request,
    @Res() res: Response
) {
    return this.bexioUserService.getToken(req, res);
}
@Post('get-access-token')
@UseInterceptors(AnyFilesInterceptor())

async getAccessToken(
  @Req() req: Request,
  @Res() res: Response
): Promise<any> {
  return this.bexioUserService.getAccessToken(req, res);
}

@Post('refresh-access-token')
@UseInterceptors(AnyFilesInterceptor())

async refreshTokenCreate(
  @Req() req: Request,
  @Res() res: Response
): Promise<any> {
  return this.bexioUserService.refreshTokenCreate(req, res);
}

}
