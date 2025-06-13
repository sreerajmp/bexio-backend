// Service for Bexio API integration
import { Injectable } from '@nestjs/common';

@Injectable()
export class BexioService {
  async pushContact(contact: any): Promise<void> {
    // TODO: Implement Bexio API call to push contact
  }
}
