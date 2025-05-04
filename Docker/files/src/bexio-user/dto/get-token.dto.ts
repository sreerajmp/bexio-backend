import { IsString, IsNotEmpty } from 'class-validator';

export class GetTokenDto {
    @IsString()
    @IsNotEmpty()
    partyAccount: string;

    @IsString()
    @IsNotEmpty()
    token: string;
} 