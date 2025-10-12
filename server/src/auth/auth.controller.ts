import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Request,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from './zod/auth.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../modules/permissions/permissions.enum';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.register(registerDto);
    return res.json({
      status: HttpStatus.OK,
      message: 'Register successfully',
      data: result.user,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOpts = {
      httpOnly: true as const,
      sameSite: 'lax' as const,
      secure: isProd,
      path: '/',
      // maxAge optional; JWTs have exp inside
    };
    res.cookie('access_token', result.access_token, cookieOpts);
    res.cookie('refresh_token', result.refresh_token, {
      ...cookieOpts,
      path: '/auth',
    });

    const data = {
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };

    return res.json({
      status: HttpStatus.OK,
      message: 'Login successfully',
      data,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refresh_token') token: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.refreshToken(token);
    return res.json({
      status: HttpStatus.OK,
      message: 'Refresh token successfully',
      data: result,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.PROFILE_READ)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req, @Res() res: Response) {
    const result = await this.authService.getProfile(req.user.userId);
    return res.json({
      status: HttpStatus.OK,
      message: 'Get profile successfully',
      data: result,
    });
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.PROFILE_UPDATE)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req,
    @Body(new ZodValidationPipe(updateProfileSchema))
    updateProfileDto: UpdateProfileDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.updateProfile(
      req.user.userId,
      updateProfileDto,
    );
    return res.json({
      status: HttpStatus.OK,
      message: 'Update profile successfully',
      data: result,
    });
  }

  @Get('csrf')
  @HttpCode(HttpStatus.OK)
  async csrf(@Res() res: Response) {
    const token = crypto.randomBytes(16).toString('hex');
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('csrf_token', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    });
    return res.json({
      status: HttpStatus.OK,
      message: 'CSRF token generated successfully',
      data: { csrfToken: token },
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async me(@Request() req, @Res() res: Response) {
    const result = await this.authService.getProfile(req.user.userId);
    return res.json({
      status: HttpStatus.OK,
      message: 'Get profile successfully',
      data: result,
    });
  }
}
