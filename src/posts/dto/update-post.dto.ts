import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ example: 'This is my updated post content!', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=150', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'public', enum: ['public', 'private'], required: false })
  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'public', 'private'])
  privacy?: string;
}
