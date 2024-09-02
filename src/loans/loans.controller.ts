import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import MainGuard from 'src/guards/guards';
import { RequestLoanDto } from '@dtos/loan.dto';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly service: LoansService
  ) {}
  
  @UseGuards(MainGuard)
  @Post(`/request`)
  public async RequestLoan(@Body() req: RequestLoanDto) {
    return this.service.RequestLoan(req);
  }

  @UseGuards(MainGuard)
  @Get(`/:id`)
  public async GetLoanDetails(@Param("id") id: string) {
    return this.service.GetLoanDetails(Number(id));
  }
}
