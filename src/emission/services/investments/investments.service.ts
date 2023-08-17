import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { Iso14064Service } from '../iso14064.service';
import { GHGProtocolService } from '../GHGProtocol.service';
import { investmentsDto } from './investments.dto';
import { activityType } from 'src/emission/enum/invests.enum';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { NetZeroFactor } from 'src/emission/emission-factors/net-zero/netzero-factors.entity';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';

@Injectable()
export class InvestmentsService implements Iso14064Service, GHGProtocolService {

  constructor(
    private service: NetZeroFactorService,
    private converesionService: UnitConversionService
  ) { }

  async calculationGHGProtocol(data: any) {
    let e_sc = 0;

    console.log("ddddd", data)


    let investeeSector = 0
    let operatingtSector = 0
    let constructSector = 0

    // let ec_unit = ParamterUnit.investments_consumption;
    //  let value = data.ec;
    // let {EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.EF_GE] );

    // let dataUnit = data.ec_unit

    // if (dataUnit !== ec_unit){
    //   value = this.converesionService.convertUnit(value, dataUnit, ec_unit).value



    let res = await this.service.getNetZeroFactors(data.year, data.baseData.countryCode, sourceName.Investments,
      [
        data.data['investeeSector'],
        data.data['operatingtSector'],
        data.data['constructSector']

      ]);

    investeeSector = res[data.data['investeeSector']]
    operatingtSector = res[data.data['investeeSector']]
    constructSector = res[data.data['investeeSector']]


    investeeSector = (data.data.ef_InvesteeSector > 0) ? data.data.ef_InvesteeSector : investeeSector;
    operatingtSector = (data.data.ef_relevantOperatingSector > 0) ? data.data.ef_relevantOperatingSector : operatingtSector;
    constructSector = (data.data.ef_ReleventConsSector > 0) ? data.data.ef_ReleventConsSector : constructSector;



    switch (data.activityType) {
      case activityType.methodA: {
        e_sc = data.data['scp1scpe2EmissionsOfEquityInvestment'] * data.data['shareOfEquity']/100;

        break;
      }

      case activityType.methodB: {
        e_sc = data.data['investeeCompanyTotalRevenue'] * investeeSector * data.data['shareOfEquity']/100;
        break;
      }

      case activityType.methodC: {
        e_sc = data.data['scp1scp2EmissionRelevantProject'] * data.data['shareOfTotalProjectCosts']/100;
        break;
      }

      case activityType.methodD: {

        e_sc =  (data.data['projectRevenueInReportingYear'] * operatingtSector * data.data['shareOfTotalProjectCosts']/100) +(data.data['projectConstructionCost'] * constructSector * data.data['shareOfTotalProjectCosts']/100) ;
        break;
      }

      case activityType.methodE: {
        e_sc = data.data['projectedAnnualEmissionsOfProject'] * data.data['projectedLifetimeOfProject'] * data.data['shareOfTotalProjectCosts']/100;
        break;
      }

      default: {
        e_sc = 0
      }
    }


    let response = new emissionCalResDto();
    response.e_sc = e_sc;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    console.log("rrr", response)

    return response;
  }

  async calculationIso14064(data: investmentsDto) {

    // let ec_unit = ParamterUnit.investments_consumption;
    // let value = data.ec;
    // let {EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.EF_GE] );

    // let dataUnit = data.ec_unit

    // if (dataUnit !== ec_unit){
    //   value = this.converesionService.convertUnit(value, dataUnit, ec_unit).value
    // }


    let response = new emissionCalResDto();
    response.e_sc = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }




}





