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

@Injectable()
export class upstreamLeasedAssetsService implements Iso14064Service, GHGProtocolService {

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
    console.log("rrrrrrrrrrrrrrrrrrrrrrr", data)

    let e_sc: number;

    let co2 = 0;
    let ch4 = 0;
    let n2o = 0;
    let total = 0;

    let { gwp_co2, gwp_ch4, gwp_n2o } =
      await this.service.getCommonEmissionFactors(
        data.year,
        data.baseData.countryCode,
        [
          emissionFactors.gwp_co2,
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_n2o,
        ],
      );


       let fuel = await this.fuelFactorService.getFuelFactors2(sourceName.Upstream_Leased_Assets, data.baseData.sourceType, data.baseData.industry,
      data.baseData.tier, data.year, data.baseData.countryCode, [data.data['fuel_type']])


      let elec = await this.EFservice.getNetZeroFactors(data.year, data.baseData.countryCode, sourceName.Upstream_Leased_Assets,
        [
       data.data['fuel_type']

        ]);
       let elecFac = elec[data.data['fuel_type']]




    let ref = await this.service.getCommonEmissionFactors(
      data.year,
      data.baseData.countryCode,
      // [emissionFactors.GWP_RG_R407C, emissionFactors.GWP_RG_R134a, emissionFactors.GWP_RG_R22, emissionFactors.GWP_RG_R134a],
      ['GWP_RG_' + data.data['refrigerant_type'] as emissionFactors],

    );

   
    let refVal = ref['GWP_RG_' + data.data['refrigerant_type']]
    console.log("ref", ref,refVal)
    let type = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
      [
        data.data['building_type']
      ]);




    let bFac = type[data.data['building_type']]
    let aFac = type[data.data['asset_type']]





    let vol_units = ["L", "M3"]
    let vol_unit = ParamterUnit.fuel_energy_related_activities_vol
    let value = data.data.fuel_quntity

    let scp1scp2_emissions_lessor = data.data.scp1scp2_emissions_lessor;
    let lease_assests_ratio = data.data.lease_assests_ratio
    let total_floor_space = data.data.total_floor_space;
    let number_of_assets = data.data.number_of_assets;

    if (data.data['fuel_type'] == 'Fuel') {
     

      let fuel_quntity_unit = data.data.fuel_quntity_unit

      if (vol_units.includes(fuel_quntity_unit)) {

        if ((vol_unit !== fuel_quntity_unit)) {

          value = this.conversionService.convertUnit(value, fuel_quntity_unit, vol_unit).value

        }

      }



    }
    console.log("OKK")

    console.log("OKK",data.data)
    switch (data.activityType) {
      case UpstreamLeasedAssetDataMethod.FuelAssetSpecificMethod: {
        if (data.data['typeName'] == 'Fuel') {
          co2 = ((fuel.co2_default * gwp_co2) / 1000) * value;
          ch4 = ((fuel.ch4_default * gwp_ch4) / 1000) * value;
          n2o = ((fuel.n20_default * gwp_n2o) / 1000) * value;

          e_sc = co2+ch4+n2o;

        } 
        
        if (data.data['typeName'] == 'Electricity') {
          e_sc = elecFac * value;
        } 
        
        if (data.data['typeName']=='Refrigerent') {
          value = data.data.refrigerant_quntity;
          e_sc = value * refVal +data.data.process_emission;

          console.log("OKK",e_sc)

        }
        break;
      }

      case UpstreamLeasedAssetDataMethod.DistanceLessorSpecificMethod: {
        e_sc = scp1scp2_emissions_lessor * lease_assests_ratio

        break;
      }

      case UpstreamLeasedAssetDataMethod.SpendLeasedBuildingsMethod: {
        if(data.data['userInputEF']){
          bFac=data.data['userInputEF']
        }
        e_sc = total_floor_space * bFac
        console.log("OKK",e_sc,total_floor_space,bFac)
        break;
      }

      case UpstreamLeasedAssetDataMethod.LeasedAssetsMethod: {
        if(data.data['userInputEF']){
          aFac=data.data['userInputEF']
        }
        e_sc = number_of_assets * aFac;
        break;
      }

      default: {
        e_sc = 0;
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