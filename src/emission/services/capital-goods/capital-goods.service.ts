import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';
import {  CapitalGoodsDto, capitalGoodData } from './capital-goods.dto';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';

@Injectable()
export class CapitalGoodsService implements Iso14064Service, GHGProtocolService {
  constructor(
    private netZeroFactorService: NetZeroFactorService,
    private conversionService: UnitConversionService,
  ) { }

  calculationIso14064(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationGHGProtocol(data: CapitalGoodsDto) {
    let response = new emissionCalResDto();
    response = await this.calculateTotalemmision(data.data,data.year, data.month, data.baseData)
    return response;
  }

  async calculateTotalemmision(data: capitalGoodData,year:number,month:number,baseData:BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;
    let { category,quantity,user_input_ef} = data
    let  res  = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Capital_Goods, [category as netZeroFactors]);
    let emissionFactor = (user_input_ef > 0) ? user_input_ef : res[category];
    
    total = (emissionFactor * quantity) ;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total;
    return response;
  }

}
