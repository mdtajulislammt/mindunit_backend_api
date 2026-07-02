import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({ example: 'najim10112004@gmail.com', description: 'The email address to send the verification code' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
