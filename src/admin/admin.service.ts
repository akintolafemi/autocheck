import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseManager } from '@utils/response.manager.utils';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  //Assuming since username and password are already validated in AuthMiddleware, we can proceed to generate signed JWT token for admin
  async signJWT(email: string) {
    const payload = {
      email
    };
    const token = this.jwtService.sign(payload);
    return ResponseManager.standardResponse({
      statusText: "success",
      message: "Authentication successful",
      status: HttpStatus.OK,
      data: {
        token
      }
    });
  }
}
