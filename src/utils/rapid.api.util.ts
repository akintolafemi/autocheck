import axios from "axios";
import { VIN_LOOK_UP_ENDPOINT } from "src/constants/constant.constants";

export const LookUpVin = async (vin) => {
  try {
    const response = await axios({
      url: `${VIN_LOOK_UP_ENDPOINT}`,
      method: `GET`,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-rapidapi-key': `${process.env.RAPID_API}`,
        'x-rapidapi-host': `${process.env.RAPID_API_HOST}`,
      },
      params: {
        vin
      }
    });
    return response.data;
  } catch (error) {
    console.log(error?.response)
    return error?.response?.data
  }
}