import { RequestLoanDto } from '@dtos/loan.dto';
import { Loan } from '@entities/loan.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseManager, standardResponse } from '@utils/response.manager.utils';
import { LOAN_INTERESTS, NOW } from 'src/constants/constant.constants';
import { Not, Repository } from 'typeorm';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  async RequestLoan(req: RequestLoanDto): Promise<standardResponse | HttpException> {
    try {
      //check if user has a pending loan
      const pendingLoan = await this.loansRepository.findOne({
        where: {
          userid: req.userid,
          status: Not("settled-complete")
        }
      })
      if (pendingLoan) {
        throw new HttpException(`User has a pending loan`, HttpStatus.FORBIDDEN, {
          cause: `pendingloan`, 
          description: `User has a pending loan`
        });
      }
      //start checking eligibility
      //1. Verify user NIN/BVN if not already verified
      //2. Calculate credit score from previous loan requests or other applicable algorithms
      //3. 

      //if any of the checks failed, return matching error

      const duration = req.duration
      const interestrate = LOAN_INTERESTS[req.duration]
      const totalpayable = (Number(req.amount) * interestrate) + Number(req.amount)

      const data = await this.loansRepository.save({
        createdat: NOW(),
        amount: req.amount,
        duration: duration,
        interestrate,
        totalpayable: `${totalpayable}`,
        statushistory: {requestedon: NOW()},
        userid: req.userid,
        approvedby: null,
        updatedat: null,
        approved: false,
        status: "pending"
      })

      return ResponseManager.standardResponse({ //send out response if everything works well
        message: `Loan request accepted successfully!`,
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

  async GetLoanDetails(id: number): Promise<standardResponse | HttpException> {
    try {
      const loan = await this.loansRepository.findOne({
        where: {
          id
        }
      })

      if (!loan) {
        throw new HttpException(`Loan not found`, HttpStatus.NOT_FOUND, {
          cause: `invalid`, 
          description: `Loan not found`
        });
      }

      return ResponseManager.standardResponse({ //send out response if everything works well
        message: `Loan data returned successfully!`,
        status: HttpStatus.OK,
        statusText: "success",
        data: loan
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
