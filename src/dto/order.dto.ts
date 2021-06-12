import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  agentId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderInfo: string;

  @ApiProperty()
  @IsOptional()
  products: Array<number>;
}
