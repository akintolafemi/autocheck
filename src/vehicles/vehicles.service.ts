import { CreateVehicleDto } from '@dtos/vehicle.dto';
import { Vehicle } from '@entities/vehicle.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { LookUpVin } from '@utils/rapid.api.util';
import { ResponseManager, standardResponse } from '@utils/response.manager.utils';
import { NOW } from 'src/constants/constant.constants';
import RequestWithUser from 'src/types/request.with.user.type';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @Inject(REQUEST) private request: RequestWithUser
  ) {}

  async CreateVehicle(req: CreateVehicleDto): Promise<standardResponse | HttpException> {
    try {
      
      const vehicle = await this.vehiclesRepository.findOne({
        where: {
          vin: req.vin
        }
      })

      if (vehicle) {
        throw new HttpException(`Vehicle with ${req.vin} already exists!`, HttpStatus.CONFLICT, {
          cause: `duplicate`, 
          description: `Vehicle with ${req.vin} already exists!`
        });
      }

      const data = await this.vehiclesRepository.save({
        vin: req.vin,
        make: req.make,
        mileage: req.mileage,
        model: req.model,
        year: req.year,
        createdat: NOW(),
        createdby: this.request.user.email
      })

      return ResponseManager.standardResponse({ //send out response if everything works well
        message: `Vehicle data created successfully!`,
        status: HttpStatus.CREATED,
        statusText: "success",
        data: data
      })

    } catch (error) { //handle error response
      throw new HttpException({
        message: error?.response || "Unknown error has occured",
        statusText: "error",
        status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        data: error
      }, error?.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async GetVehicleValuation(vin: string): Promise<standardResponse | HttpException> {
    try {
      const valuation = await LookUpVin(vin)

      return ResponseManager.standardResponse({ //send out response if everything works well
        message: `Vehicle data returned successfully!`,
        status: HttpStatus.OK,
        statusText: "success",
        data: valuation
      })

    } catch (error) {
      throw new HttpException({
        message: error?.response || "Unknown error has occured",
        statusText: "error",
        status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        data: error
      }, error?.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
