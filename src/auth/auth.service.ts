import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async signIn(userDTO: SignInDto): Promise<LoginResponseDto> {

    const user = await this.userModel.findOne({ where: { email: userDTO.email } });

    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await bcrypt.compare(user.password, userDTO.password);

    if (!passwordMatch) throw new UnauthorizedException();

    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role
    };

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    const id = user.id;
    
    await this.userModel.update(
      { refresh_token: refresh_token },
      { where: { id } }
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      expires_in: 3600
    };
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    const userModel = await this.userModel.findOne({ where: { refresh_token: refreshToken } });

    if (!userModel) throw new UnauthorizedException('Invalid refresh token');

    const payload = { id: userModel.id, username: userModel.username };
    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const new_refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    await this.userModel.update(
      { refresh_token: new_refresh_token },
      { where: { userModel.id } }
    );
    return {
      access_token,
      refresh_token: new_refresh_token,
      user: {
        id: userModel.id,
        email: userModel.email,
        roles: userModel.roles,
      },
      expires_in: 3600
    };
  }
}