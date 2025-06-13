// Handles HTTP endpoints for importing contacts from Salesforce and pushing to Bexio
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContactImportService } from './contact-import.service';
import { ImportContactDto } from './dto/import-contact.dto';

@ApiTags('Contact Import')
@Controller('contact-import')
export class ContactImportController {
  constructor(private readonly contactImportService: ContactImportService) {}

  @Post('import')
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
  async importContacts(@Body() dto: ImportContactDto) {
    return this.contactImportService.importContacts(dto);
  }

  @Get('job-status')
  @ApiQuery({ name: 'netcomid', required: true, description: 'Company netcomid' })
  async getJobStatus(@Query('netcomid') netcomid: string) {
    if (!netcomid) {
      return { message: 'netcomid is required', status: 400 };
    }
    const job = await this.contactImportService.getCurrentJobStatus(netcomid);
    if (!job) {
      return { message: 'No job found for this netcomid', status: 404 };
    }
    return { status: 200, job };
  }
}
