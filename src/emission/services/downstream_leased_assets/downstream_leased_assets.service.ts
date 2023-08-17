import { Injectable } from "@nestjs/common";
import { emissionCalResDto } from "src/emission/dto/emission-res.dto";
import { CommonEmissionFactorService } from "src/emission/emission-factors/common-emission-factor.service";
import { FuelFactorService } from "src/emission/emission-factors/fuel-factor.service";
import { NetZeroFactorService } from "src/emission/emission-factors/net-zero/netzero-factors.service";
import { emissionFactors } from "src/emission/enum/emissionFactors.enum";
import { ActivityType } from "src/emission/enum/fuel-energy-activity.enum";
import { ParamterUnit } from "src/emission/enum/parameterUnit.enum";
import { sourceName } from "src/emission/enum/sourcename.enum";
import { UpstreamLeasedAssetDataMethod } from "src/emission/enum/upstream-leased-assets.enum";
import { UnitConversionService } from "src/unit-conversion/unit-conversion.service";
import { GHGProtocolService } from "../GHGProtocol.service";
import { Iso14064Service } from "../iso14064.service";
import { DownstreamLeasedAssetsMethod } from "src/emission/enum/downstream-leased-assets.enum";

@Injectable()
export class DownstreamLeasedAssetsService implements Iso14064Service, GHGProtocolService {

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
    console.log("rffff", data.data['refrigerant_type'])

    let e_sc: number;




  



    let ref = await this.service.getCommonEmissionFactors(
      data.year,
      data.baseData.countryCode,
      // [emissionFactors.GWP_RG_R407C, emissionFactors.GWP_RG_R134a, emissionFactors.GWP_RG_R22, emissionFactors.GWP_RG_R134a],
      ['GWP_RG_' + data.data['refrigerant_type'] as emissionFactors],

    );

   
    let refVal = ref['GWP_RG_' + data.data['refrigerant_type']]
    console.log("ref", ref,refVal)
   





    let vol_units = ["L", "M3"]
    let vol_unit = ParamterUnit.fuel_energy_related_activities_vol
    let value = data.data.fuel_quntity

    let scp1scp2_emissions_lessor = data.data.scp1scp2_emissions_lessor;
    let lease_assests_ratio = data.data.lease_assests_ratio
    let total_floor_space = data.data.total_floor_space;
    let number_of_assets = data.data.number_of_assets;

    if (data.data['fuel_type']) {
     

      let fuel_quntity_unit = data.data.fuel_quntity_unit

      if (vol_units.includes(fuel_quntity_unit)) {

        if ((vol_unit !== fuel_quntity_unit)) {

          value = this.conversionService.convertUnit(value, fuel_quntity_unit, vol_unit).value

        }

      }



    }
    console.log("OKK")

    console.log("OKK",data,data.data)
    switch (data.method) {
      case DownstreamLeasedAssetsMethod.AssetSpecificMethod: {
        if (data.data['fuel_type']) {
          let fuel = await this.fuelFactorService.getFuelFactors2(sourceName.Downstream_Leased_Assets, data.baseData.sourceType, data.baseData.industry,
            data.baseData.tier, data.year, data.baseData.countryCode, [data.data['fuel_type']])
            if(fuel===-1){
              throw new Error("No Fuel Emission Factor")
            }
          console.log("rffffuelf", fuel)
          e_sc = value * fuel.co2_default;



        } if (data.data['refrigerant_type']) {
          value = data.data.refrigerant_quntity;
          e_sc = value * refVal +data.data.process_emission;

          console.log("OKK",e_sc)

        }
        break;
      }

      case DownstreamLeasedAssetsMethod.LessorSpecificMethod: {
        e_sc = scp1scp2_emissions_lessor * lease_assests_ratio
        console.log("OKK",e_sc,scp1scp2_emissions_lessor,lease_assests_ratio)

        break;
      }

      case DownstreamLeasedAssetsMethod.LeasedBuildingsMethod: {
        let type = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
          [
            data.data['building_type']
          ]);
        let bFac = type[data.data['building_type']]
       
        if(data.data['user_input_ef']){
          bFac=data.data['user_input_ef']
        }
        e_sc = total_floor_space * bFac
        console.log("OKK",e_sc,total_floor_space,bFac)
        break;
      }

      case DownstreamLeasedAssetsMethod.LeasedAssetsMethod: {
        let type = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
          [
            data.data['asset_type']
          ]);
    

        let aFac = type[data.data['asset_type']]
        if(data.data['user_input_ef']){
          aFac=data.data['user_input_ef']
        }
       
        e_sc = number_of_assets * aFac;
        break;
      }

      default: {
        e_sc = 0;
      }
    }



    let response = new emissionCalResDto();
    response.e_sc = e_sc;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }
}