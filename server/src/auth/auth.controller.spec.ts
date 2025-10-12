import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockRegisterResponse = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockLoginResponse = {
    access_token: 'mock_jwt_token',
  };

  const mockProfileResponse = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockRegisterResponse),
            login: jest.fn().mockResolvedValue(mockLoginResponse),
            getProfile: jest.fn().mockResolvedValue(mockProfileResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(ZodValidationPipe).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user', async () => {
      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockRegisterResponse);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login a user', async () => {
      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('getProfile', () => {
    const mockRequest = {
      user: { userId: 1 },
    };

    it('should get user profile', async () => {
      const result = await controller.getProfile(mockRequest);

      expect(authService.getProfile).toHaveBeenCalledWith(
        mockRequest.user.userId,
      );
      expect(result).toEqual(mockProfileResponse);
    });
  });
});
