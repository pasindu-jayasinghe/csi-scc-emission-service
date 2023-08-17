import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UnitConversionService } from './unit-conversion.service';
import { UnitConversionReqDto } from './dto/unit-conversion-req.dto';
import { MasterDataService } from 'src/shared/master-data.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('unit-conversion')
export class UnitConversionController {
  constructor(private readonly unitConversionService: UnitConversionService,
    private masterdata: MasterDataService) {}

  @Post('/convert')
  public convertUnit(@Body() req: UnitConversionReqDto){
    return this.unitConversionService.convertUnit(req.value, req.fromUnit, req.toUnit)
  }
}
