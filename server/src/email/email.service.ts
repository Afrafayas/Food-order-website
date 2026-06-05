import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    await this.resend.emails.send({
      from: 'FoodCorner <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #FF6B35; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP expires in <b>5 minutes</b></p>
        <p>Do not share this OTP with anyone.</p>
      `,
    });
  }
}