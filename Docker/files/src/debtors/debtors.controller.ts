import { Controller, Post, UseInterceptors, Req, Res, Body, UseGuards } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RedisCacheInterceptor } from 'src/common/interceptor/redisStore';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GetInvoiceDto, GetOrderListDto, GetDeliveryNotesListDto, SendInvoiceDto, SendOrderDto } from './dto/debtors.dto';
import { CookieAuthGuard } from 'src/common/guards/cookie-auth.guard';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@UseGuards(CookieAuthGuard)
@ApiTags('Debtors')
@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService,
  ) {

  }
  @UseInterceptors(RedisCacheInterceptor)
  @Post('getInvoice')
  @ApiOperation({ summary: 'Get list of invoices', description: 'Retrieves a paginated list of invoices with optional filters.' })
  @ApiBody({ type: GetInvoiceDto })
  @ApiResponse({ status: 200, description: 'List of invoices retrieved successfully.' })
  @UseInterceptors(AnyFilesInterceptor())
  async getInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log('controller getInvoice');
    return this.debtorsService.getInvoiceV2(req, res);
  }

  @UseInterceptors(RedisCacheInterceptor)
  @Post('getOrderList')
  @ApiOperation({ summary: 'Get list of orders', description: 'Retrieves a paginated list of orders with optional filters.' })
  @ApiBody({ type: GetOrderListDto })
  @ApiResponse({ status: 200, description: 'List of orders retrieved successfully.' })
  @UseInterceptors(AnyFilesInterceptor())
  async getOrderList(@Req() req: Request, @Res() res: Response): Promise<any> {
    // console.log('Received body:', req);
    return this.debtorsService.getOrderList(req, res);
  }

  @UseInterceptors(RedisCacheInterceptor)
  @Post('getDeliveryNotesList')
  @ApiOperation({ summary: 'Get list of delivery notes', description: 'Retrieves a paginated list of delivery notes.' })
  @ApiBody({ type: GetDeliveryNotesListDto })
  @ApiResponse({ status: 200, description: 'List of delivery notes retrieved successfully.' })
  @UseInterceptors(AnyFilesInterceptor())
  async getDeliveryNotesList(@Req() req: Request, @Res() res: Response): Promise<any> {
    // console.log('Received body:', req);
    return this.debtorsService.getDeliveryNotesList(req, res);
  }

  @Post('sendInvoice')
  @ApiOperation({ summary: 'Send an invoice', description: 'Sends an invoice to the specified recipient.' })
  @ApiBody({ type: SendInvoiceDto })
  @ApiResponse({ status: 200, description: 'Invoice sent successfully.' })
  @UseInterceptors(AnyFilesInterceptor())
  async sendInvoice(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.sendInvoice(req, res);
  }

  @Post('sendOrder')
  @ApiOperation({ summary: 'Send an order', description: 'Sends an order to the specified recipient.' })
  @ApiBody({ type: SendOrderDto })
  @ApiResponse({ status: 200, description: 'Order sent successfully.' })
  @UseInterceptors(AnyFilesInterceptor())
  async sendOrder(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.sendOrder(req, res);
  }

  @Post('sendDeliveryNotes')
  @ApiOperation({ summary: 'Send delivery notes', description: 'Sends delivery notes to the specified recipient.' })
  @UseInterceptors(AnyFilesInterceptor())
  async sendDeliveryNotes(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.sendDeliveryNotes(req, res);
  }
  @Post('viewInvoicePdf')
  @ApiOperation({ summary: 'View Invoice PDF', description: 'Retrieves invoice details for PDF viewing.' })
  @UseInterceptors(AnyFilesInterceptor())
  async viewInvoicePdf(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.invoiceDetails(req, res);
  }

  @Post('invoiceDetails')
  @ApiOperation({ summary: 'Get invoice details', description: 'Retrieves detailed information about a specific invoice.' })
  @UseInterceptors(AnyFilesInterceptor())
  async invoiceDetails(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.invoiceDetails(req, res);
  }
  @SkipAuth()
  @Post('changeInvoiceSendStatus')
  @ApiOperation({ summary: 'Change Invoice Send Status', description: 'Updates the send status of an invoice.' })
  @UseInterceptors(AnyFilesInterceptor())
  async changeInvoiceSendStatus(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.debtorsService.changeInvoiceSendStatus(req, res);
  }

}
