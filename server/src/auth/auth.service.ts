import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { EmailService } from '../email/email.service';

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { name, email, password, phone, address } = registerDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      otp,
      otpExpires,
      isVerified: false,
    });

    await this.emailService.sendOTP(email, otp);

    return { message: 'OTP sent to your email!' };
  }

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    if (user.otp !== otp) throw new BadRequestException('Invalid OTP');
    if (!user.otpExpires || user.otpExpires < new Date()) throw new BadRequestException('OTP expired');

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = this.jwtService.sign({
      user: { id: user._id, role: user.role }
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) throw new BadRequestException('Please verify your email first');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      user: { id: user._id, role: user.role }
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}