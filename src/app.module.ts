import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonEmissionFactor } from './emission/emission-factors/common-emission-factor.entity';
import { FuelFactor } from './emission/emission-factors/fuel-factor.entity';
import { EmissionModule } from './emission/emission.module';
import { UnitConversionModule } from './unit-conversion/unit-conversion.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [configuration],
      envFilePath: ['.env.development']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const {
          host,
          port,
          database,
          username,
          password,
          type,
          synchronize,
          migrationsRun,
        } = configService.get('database');
        return {
          type,
          host,
          port,
          database,
          username,
          password,
          synchronize,
          migrationsRun,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/migrations',
          },
        };
      },
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([]),
    AuthModule,
    EmissionModule,


    UnitConversionModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],



  
})
export class AppModule {}
