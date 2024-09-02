import * as moment from 'moment';

export const NOW = () => { //momentjs can act funny some times using UTC, so force to use the active user's timezone then use the value as datetime where necessary
  return moment(new Date()).utc(true).toDate() 
}
export const VIN_LOOK_UP_ENDPOINT = `https://vin-lookup2.p.rapidapi.com/vehicle-lookup`

export const LOAN_STATUS_ENUM = ["pending", "approved", "rejected", "disbursed", "settled-part", "settled-complete"] as const

export type loanStatus = typeof LOAN_STATUS_ENUM[number]

export const LOAN_DURATION_ENUM = [1, 3, 6, 12, 18, 24] as const

export type loanDuration = typeof LOAN_DURATION_ENUM[number]

export const LOAN_INTERESTS = {
  1: 0.02,
  3: 0.025,
  6: 0.035, 
  12: 0.05,
  18: 0.1,
  24: 0.12
}