import { Controller,Post,Body ,UseInterceptors,Get,Req,Res, Param, Query } from '@nestjs/common';
import { BexioUserService } from './bexio-user.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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


// @Get('bexioRedirect')
// async bexioRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
//   console.log('Query params:', req); // optional debug
//   return this.bexioUserService.bexioRedirect(req, res);
// }

// @Get('bexio-redirect/:code')
// async handleParamCallback(@Req() req: Request): Promise<any> {
//   console.log('check'); // optional debug
//   return this.bexioUserService.bexioRedirect(req, res);
// }
@Post('authorization')
@UseInterceptors(AnyFilesInterceptor()) //This enables form-data parsing
async authorization (@Body() data: any): Promise<any> {
console.log('Received body:', data);
return this.bexioUserService.authorization (data);
}

}
