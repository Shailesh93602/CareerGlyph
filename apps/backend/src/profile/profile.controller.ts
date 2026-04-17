import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('health')
  getHealth(): string {
    return this.profileService.getHealth();
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get a developer profile by username' })
  @ApiParam({ name: 'username', example: 'shailesh93602' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'Developer not found or profile is private' })
  getProfile(@Param('username') username: string) {
    return this.profileService.getByUsername(username);
  }
}