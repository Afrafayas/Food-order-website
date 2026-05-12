import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Food Order App" <${process.env.MAIL_USER}>`,
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