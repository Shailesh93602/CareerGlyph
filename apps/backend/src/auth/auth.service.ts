import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHealth(): string {
    return 'Auth service is running';
  }
}