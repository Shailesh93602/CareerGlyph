import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'shailesh93602' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Shailesh Chaudhari' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'shailesh@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
