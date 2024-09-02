import { LOAN_DURATION_ENUM, LOAN_STATUS_ENUM, loanDuration, loanStatus } from 'src/constants/constant.constants';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
  })
  userid: number; //foreign key to users table in primary key index

  @Column({
    type: "decimal"
  })
  amount: string

  @Column({
    type: "int",
    default: 0.025
  })
  interestrate: number

  @Column({
    type: "decimal"
  })
  totalpayable: string

  @Column({
    type: "int",
    // enum: LOAN_DURATION_ENUM,
    default: 12 //in months
  })
  duration: loanDuration

  @Column({
    type: "datetime",
  })  
  createdat: Date

  @Column({
    type: "varchar",
    // enum: LOAN_STATUS_ENUM,
    //pending -> newly requested
    //approved -> loan request granted
    //rejected -> loan request rejected
    //disbursed -> loan request approved and has now been sent out
    //settled-part -> a part of loan has been settled. A table to be created to keep track of loan installment payment. Table to include
    //a foreign key linking back to Loan table
    //settled-complete -> repayment completed by user
    default: "pending"
  })
  status: loanStatus

  @Column({
    type: "boolean",
    default: false
  })
  approved: boolean

  @Column({
    type: "int",
    nullable: true
  })
  approvedby: number //foreign key to users (an admin user) table in primary key index

  @Column({
    type: "json",
    default: "{}"
  })
  statushistory: object  //keep track of loan status change records

  @Column({
    type: "datetime",
    default: null
  })  
  updatedat: Date

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