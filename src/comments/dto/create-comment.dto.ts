import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is an awesome post!' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
