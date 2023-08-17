import { Injectable } from "@nestjs/common";
import { emissionCalResDto } from "src/emission/dto/emission-res.dto";
import { CommonEmissionFactorService } from "src/emission/emission-factors/common-emission-factor.service";
import { FuelFactorService } from "src/emission/emission-factors/fuel-factor.service";
import { NetZeroFactorService } from "src/emission/emission-factors/net-zero/netzero-factors.service";
import { emissionFactors } from "src/emission/enum/emissionFactors.enum";
import { ActivityType } from "src/emission/enum/fuel-energy-activity.enum";
import { ParamterUnit } from "src/emission/enum/parameterUnit.enum";
import { sourceName } from "src/emission/enum/sourcename.enum";
import { UnitConversionService } from "src/unit-conversion/unit-conversion.service";
import { GHGProtocolService } from "../GHGProtocol.service";
import { Iso14064Service } from "../iso14064.service";

@Injectable()
export class fuelEnergyRelatedActivitiesService implements Iso14064Service, GHGProtocolService {

  constructor(
    private service: CommonEmissionFactorService,
    private EFservice: NetZeroFactorService,

    private converesionService: UnitConversionService,
    private fuelFactorService: FuelFactorService,
    private conversionService: UnitConversionService,


  ) { }

  calculationIso14064(data: any) {

    throw new Error("Method not implemented.");
  }

  async calculationGHGProtocol(data: any) {

    console.log("DATA---", data)
    let e_sc: number;


    let res = await this.EFservice.getNetZeroFactors(data.year, data.baseData.countryCode, sourceName.Investments,
      [
        data.data.fuelType,

      ]);

    let { TD_LOSS } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.TD_LOSS]);


    let fuelFac = (data.data.user_input_ef > 0) ? data.data.user_input_ef : res[data.data.fuelType];




    let vol_units = ["L", "M3"]
    let vol_unit = ParamterUnit.fuel_energy_related_activities_vol
    let value = data.data.consumption

    let unit = data.data.consumption_unit


    if (vol_units.includes(unit)) {

      if ((vol_unit !== unit) && unit !== 'KWH') {
        value = this.conversionService.convertUnit(value, unit, vol_unit).value
      }

    }

    switch (data.activityType) {
      case ActivityType.methodA: {
        e_sc = value * fuelFac
        break;
      }

      case ActivityType.methodB: {
        e_sc = value * fuelFac

        break;
      }

      case ActivityType.methodC: {
        e_sc = value * fuelFac * TD_LOSS;
        break;
      }

      case ActivityType.methodD: {
        e_sc = value * fuelFac;
        break;
      }

      default: {
        e_sc = value * fuelFac;
      }
    }



    let response = new emissionCalResDto();
    response.e_sc = e_sc/1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }
}