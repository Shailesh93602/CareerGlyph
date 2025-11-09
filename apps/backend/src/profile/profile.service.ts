import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  getHealth(): string {
    return 'Profile service is running';
  }
}