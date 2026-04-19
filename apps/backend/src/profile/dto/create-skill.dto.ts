import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SkillCategory, SkillLevel } from '@prisma/client';

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  name: string;

  @ApiProperty({ enum: SkillCategory })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiProperty({ enum: SkillLevel, required: false })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  yearsExp?: number;
}
