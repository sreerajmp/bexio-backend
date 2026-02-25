// Handles HTTP endpoints for importing contacts from Salesforce and pushing to Bexio
import { Controller, Post, Body, Get, Query, UseInterceptors, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContactImportService } from './contact-import.service';
import { ImportContactDto, SyncEbillConactDto } from './dto/import-contact.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { CookieAuthGuard } from 'src/common/guards/cookie-auth.guard';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@ApiTags('Contact Import')
@UseGuards(CookieAuthGuard)
@Controller('contact-import')
export class ContactImportController {
  constructor(private readonly contactImportService: ContactImportService) { }

  @Post('import')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        netcomid: { type: 'string', example: 'COMPANY123' },
        companyName: { type: 'string', example: 'ZEV Bus' },
      },
      required: ['netcomid', 'companyName'],
    },
    description: 'Trigger contact import for a company. Accepts form-data.',
  })
  async importContacts(@Body() body: any) {
    // Accept form-data: NestJS parses form fields into body as strings
    // Defensive: handle missing fields (empty string or undefined)
    const netcomid = body?.netcomid?.toString().trim();
    const companyName = body?.companyName?.toString().trim();
    if (!netcomid || !companyName) {
      return { message: 'netcomid and companyName are required in the request body', status: 400 };
    }
    const dto: ImportContactDto = {
      netcomid,
      companyName,
    };
    return this.contactImportService.importContacts(dto);
  }

  @Get('job-status')
  @ApiQuery({ name: 'netcomid', required: true, description: 'Company netcomid' })
  async getJobStatus(@Query('netcomid') netcomid: string, @Req() req: Request) {
    if (!netcomid) {
      return { message: 'netcomid is required', status: 400 };
    }
    try {
      const job = await this.contactImportService.getCurrentJobStatus(netcomid, req);
      if (!job) {
        return { message: 'No job found for this netcomid', status: 404 };
      }
      return { status: 200, job };
    } catch (e) {
      return { message: 'Unauthorized', status: 401 };
    }
  }
  @SkipAuth()
  @Post('scheduler-contact')
  @UseInterceptors(AnyFilesInterceptor())
  async schedulercontact(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.contactImportService.schedulercontact(req, res);
  }
  @Post('contactImportSearch')
  @UseInterceptors(AnyFilesInterceptor())
  async contactImportSearch(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.contactImportService.contactImportSearch(req, res);
  }
}
