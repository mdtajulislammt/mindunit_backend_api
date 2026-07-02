import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Sarah', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Rahman', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'Cognitive Neuroscientist | Professor at DU', required: false })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
