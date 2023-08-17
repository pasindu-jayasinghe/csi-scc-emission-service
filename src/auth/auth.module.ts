import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';


@Module({
  controllers:[],
  imports:[        
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.JWT_expiresIn },
    }),
  ],
  providers: [{provide:APP_GUARD, useClass: JwtStrategy}, {provide: APP_GUARD,useClass: RolesGuard}],
  exports: []
})
export class AuthModule {}
