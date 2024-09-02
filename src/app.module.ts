import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as fs from 'fs-extra';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteLogger } from '@middlewares/route.logger.middleware';
import { VehiclesModule } from './vehicles/vehicles.module';
import { LoansModule } from './loans/loans.module';
import { Vehicle } from '@entities/vehicle.entity';
import { AdminModule } from './admin/admin.module';
import { Loan } from '@entities/loan.entity';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/autocheck.sql',
      entities: [
        Vehicle,
        Loan
      ],
      synchronize: process.env.NODE_ENV === "development",
    }),
    ThrottlerModule.forRoot([{ //configure rate limit to prevent brute-force attacks
      ttl: 20000,
      limit: 5,  //1 request per 5secs
    }]),
    CacheModule.register({ //can use redis for caching but defualt to memory
      ttl: 10, //set cache data duration to 10secs,
      isGlobal: true //cache all get endpoints
    }),
    JwtModule.register({ //handle/configure JWT rules
      global: true, 
      secret: `${process.env.JWT_SECRET}`, 
      secretOrKeyProvider(requestType, tokenOrPayload, options) {  //configure private and public keys to encrypt and decrypt tokens
          switch (requestType) {
            case JwtSecretRequestType.SIGN:
              return fs.readFileSync(`./private.pem`) //private key to encrypt token
            case JwtSecretRequestType.VERIFY:
              return fs.readFileSync(`./public.pem`) //public key to decrypt verify token
            default:
              return null;
          }
      },
      signOptions: {
        algorithm: "RS256", //jwt algorithm
        issuer: `${process.env.ISSUER}`,
        subject: `${process.env.ISSUER}`,
        expiresIn: `3600 seconds`
      },
    }),
    VehiclesModule,
    LoansModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(RouteLogger) //use logger for all endpoints... see full functionality in the path @middlewares/route.logger.middleware
      .forRoutes("*")
  }}