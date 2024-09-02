import { IsNotEmpty, IsNumber, IsString, Length, MaxLength, MinLength } from "class-validator";

export class VehicleValuationDto {
  @IsString()
  @IsNotEmpty()
  vin: string
}

export class CreateVehicleDto extends VehicleValuationDto{
  @IsNumber()
  @IsNotEmpty()
  year: string

  @IsNumber()
  @IsNotEmpty()
  mileage: number

  @IsString()
  @IsNotEmpty()
  make: string

  @IsString()
  @IsNotEmpty()
  model: string
}