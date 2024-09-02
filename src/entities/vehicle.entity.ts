import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: "varchar",
    length: 20
  })
  vin: string;

  @Column({
    type: "varchar",
    length: 50
  })
  make: string;

  @Column({
    type: "varchar",
    length: 50
  })
  model: string;

  @Column({
    type: "varchar",
    length: 4
  })
  year: string;

  @Column({
    type: "int",
  })
  mileage: number;

  @Column({
    type: "varchar"
  })
  createdby: string
  
  @Column({
    type: "datetime",
  })  
  createdat: Date

  @Column({
    type: "datetime",
    default: null
  })  
  deletedat: Date

  @Column({
    type: "boolean",
    default: false
  })
  deleted: boolean
}