import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// DTO for importing contacts from Salesforce
export class ImportContactDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  netcomid: string;
  // Add any filters or options needed for import
}
export class SyncEbillConactDto {
  @ApiProperty()

  @ApiProperty()
  @IsString()
  billerId: string;
  // Add any filters or options needed for import
}