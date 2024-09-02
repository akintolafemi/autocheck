import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import MainGuard from 'src/guards/guards';
import { AdminDto } from '@dtos/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  //sign in endpoint
  @UseGuards(MainGuard) //ensure request coming in has the default bearer token
  @Post(`/signin`)
  public async SignIn(@Body() req: AdminDto) {
    return this.service.signJWT(req.email);
  }
}
