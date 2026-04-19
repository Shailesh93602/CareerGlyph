import { IsString, IsOptional, IsBoolean, IsUrl, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'EduScale' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Real-time coding battle platform' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['NestJS', 'Redis', 'Socket.io'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isHighlight?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startedAt?: string;
}
