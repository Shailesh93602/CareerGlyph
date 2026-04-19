import { Controller, Get, Param, Patch, Post, Delete, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { EndorseSkillDto } from './dto/endorse-skill.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ─── Static routes first (must precede :username param) ──────────────────

  @Get('health')
  getHealth(): string {
    return this.profileService.getHealth();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update own profile (authenticated)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(@Request() req: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.id, dto);
  }

  @Post('me/skills')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a skill to own profile' })
  @ApiResponse({ status: 201, description: 'Skill added' })
  addSkill(@Request() req: { user: { id: string } }, @Body() dto: CreateSkillDto) {
    return this.profileService.addSkill(req.user.id, dto);
  }

  @Delete('me/skills/:skillId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a skill from own profile' })
  removeSkill(
    @Request() req: { user: { id: string } },
    @Param('skillId') skillId: string,
  ) {
    return this.profileService.removeSkill(req.user.id, skillId);
  }

  @Post('me/projects')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a project to own profile' })
  @ApiResponse({ status: 201, description: 'Project added' })
  addProject(@Request() req: { user: { id: string } }, @Body() dto: CreateProjectDto) {
    return this.profileService.addProject(req.user.id, dto);
  }

  @Delete('me/projects/:projectId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a project from own profile' })
  removeProject(
    @Request() req: { user: { id: string } },
    @Param('projectId') projectId: string,
  ) {
    return this.profileService.removeProject(req.user.id, projectId);
  }

  // ─── Parameterized routes last ────────────────────────────────────────────

  @Post(':username/skills/:skillId/endorse')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Endorse a skill on another developer's profile" })
  @ApiParam({ name: 'username', example: 'shailesh93602' })
  @ApiParam({ name: 'skillId' })
  endorseSkill(
    @Request() req: { user: { id: string } },
    @Param('skillId') skillId: string,
    @Body() dto: EndorseSkillDto,
  ) {
    return this.profileService.endorseSkill(req.user.id, skillId, dto);
  }

  @Delete(':username/skills/:skillId/endorse')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove own endorsement from a skill' })
  removeEndorsement(
    @Request() req: { user: { id: string } },
    @Param('skillId') skillId: string,
  ) {
    return this.profileService.removeEndorsement(req.user.id, skillId);
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
