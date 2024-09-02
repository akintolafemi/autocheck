import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, VehicleValuationDto } from '@dtos/vehicle.dto';
import MainGuard, { AdminGuard } from 'src/guards/guards';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly service: VehiclesService
  ) {}

  @UseGuards(AdminGuard)
  @Post(``)
  public async CreateVehicle(@Body() req: CreateVehicleDto) {
    return this.service.CreateVehicle(req);
  }

  @UseGuards(MainGuard)
  @Post(`/valuation`)
  public async GetVehicleValuation(@Body() req: VehicleValuationDto) {
    return this.service.GetVehicleValuation(req.vin);
  }
}
