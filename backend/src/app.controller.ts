import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { TestUserDto } from './common/dto/test-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('success')
  getSuccess() {
    return {
      message: 'User profile retrieved successfully',
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
    };
  }

  @Get('error')
  getError() {
    throw new BadRequestException('This is a bad request sample exception');
  }

  @Post('validate')
  testValidation(@Body() body: TestUserDto) {
    return {
      message: 'Validation passed successfully',
      data: body,
    };
  }
}

