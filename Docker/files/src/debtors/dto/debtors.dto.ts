
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ description: 'Page number for pagination', example: 1 })
    @IsNumber()
    page_number: number;

    @ApiProperty({ description: 'Number of records per page', example: 10 })
    @IsNumber()
    records_per_page: number;

    @ApiProperty({ description: 'Party ID', example: 123 })
    @IsNumber()
    @IsOptional()
    partyId?: number;
}

export class GetInvoiceDto extends PaginationDto {
    @ApiProperty({ description: 'Channel filter', example: 'email', required: false })
    @IsString()
    @IsOptional()
    channel?: string;

    @ApiProperty({ description: 'Start date for filter', example: '2023-01-01', required: false })
    @IsString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ description: 'End date for filter', example: '2023-12-31', required: false })
    @IsString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ description: 'Column to sort by', example: 'id', required: false })
    @IsString()
    @IsOptional()
    orderBy?: string;

    @ApiProperty({ description: 'Sort order', example: 'desc', enum: ['asc', 'desc'], required: false })
    @IsString()
    @IsOptional()
    orderType?: string;

    @ApiProperty({ description: 'Invoice status filter', example: 'draft', required: false })
    @IsString()
    @IsOptional()
    invoiceStatus?: string;

    @ApiProperty({ description: 'Invoice number filter', required: false })
    @IsString()
    @IsOptional()
    invoiceNo?: string;
}

export class GetOrderListDto extends PaginationDto {
    @ApiProperty({ description: 'Start date for filter', example: '2023-01-01', required: false })
    @IsString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ description: 'End date for filter', example: '2023-12-31', required: false })
    @IsString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ description: 'Document number filter', required: false })
    @IsString()
    @IsOptional()
    documentNo?: string;

    @ApiProperty({ description: 'Order status filter', example: 'Yes', required: false })
    @IsString()
    @IsOptional()
    orderStatus?: string;
}

export class GetDeliveryNotesListDto extends PaginationDto {
    @ApiProperty({ description: 'Document number filter', required: false })
    @IsString()
    @IsOptional()
    documentNo?: string;
}

export class SendInvoiceDto {
    @ApiProperty({ description: 'Invoice ID', example: 1001 })
    @IsNumber()
    invoiceId: number;

    @ApiProperty({ description: 'Party ID', example: 123 })
    @IsNumber()
    partyId: number;
}

export class SendOrderDto {
    @ApiProperty({ description: 'Order ID', example: 2001 })
    @IsNumber()
    orderId: number;

    @ApiProperty({ description: 'Party ID', example: 123 })
    @IsNumber()
    partyId: number;
}
