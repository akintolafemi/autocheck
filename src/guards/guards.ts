import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

//a more complex guard that validates jwt token in header and returning the full user details and patch to request
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      
      //check if auth header exists
      if (!request.headers.authorization) {
        throw new HttpException({
          message: "Authorization token not found",
          statusText: "error",
          status: HttpStatus.UNAUTHORIZED
        }, HttpStatus.UNAUTHORIZED);
      }

      //get token from reques, decodedToken
      const token = request.headers.authorization.split(" ")[1];
      if (!token) {
        throw new HttpException({
          message: "Invalid authorization token",
          statusText: "error",
          status: HttpStatus.UNAUTHORIZED
        }, HttpStatus.UNAUTHORIZED);
      }

      //decode token
      const decodedToken = this.jwtService.verify(token);

      //get user
      const user = {
        email: decodedToken?.email
      }
      //attach user to request
      request["user"] = user;

      return true;
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: error,
        statusText: "error",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


@Injectable()
export default class MainGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization)
      throw new HttpException({
        message: "Authorization required to access endpoint",
        statusText: "error",
        status: HttpStatus.BAD_REQUEST
      }, HttpStatus.BAD_REQUEST);

    const token = request.headers.authorization.split(" ")[1];
    if (!token || token !== `${process.env.BASIC_TOKEN}`) 
      throw new HttpException({
        message: "Invalid authorization token",
        statusText: "error",
        status: HttpStatus.UNAUTHORIZED
      }, HttpStatus.UNAUTHORIZED);

    return true;
  }
}