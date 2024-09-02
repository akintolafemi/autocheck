import { IsDecimal, IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { LOAN_DURATION_ENUM, loanDuration } from "src/constants/constant.constants";

export class RequestLoanDto {
  @IsDecimal()
  @IsNotEmpty()
  amount: string

  @IsEnum(LOAN_DURATION_ENUM, {
    message: `duration must be one of the following ${LOAN_DURATION_ENUM.toString()}`
  })
  @IsNotEmpty()
  duration: loanDuration

  @IsInt()
  @IsNotEmpty()
  userid: number //in a proper app, this should be gotten from the user auth token or other mechanism implemented. Assuming users have a portal they can log in to
}