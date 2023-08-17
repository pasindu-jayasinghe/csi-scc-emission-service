import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { MunicipalWaterTariffService } from 'src/emission/emission-factors/municipalWaterTariff.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { municipalWaterDto } from './municipal-water.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class MunicipalWaterService implements Iso14064Service, GHGProtocolService  {

    constructor(
      private service: CommonEmissionFactorService,
      private conversionService: UnitConversionService,
      private tariffService: MunicipalWaterTariffService,
      ) { }

  calculationGHGProtocol(data: municipalWaterDto) {
    return this.calculationIso14064(data);
  }

    async calculationIso14064(data: municipalWaterDto) {
      console.log("dddd",data)
        let {EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.EF_GE] );
        let {CF_MW} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.CF_MW] );
        
        //let EF_GE =0.4694;
        //let cf_mw = 0.35;

        let monServiceCharge : number;
        let e_mw: number;


        let vol_units = ["L", "M3"]
        let vol_unit = ParamterUnit.municipal_water_vol

        let value = data.consumption

        let unit = data.unit

      if (vol_units.includes(unit)) {
        if (vol_unit !== unit) {
          value = this.conversionService.convertUnit(value, unit, vol_unit).value
        }
        e_mw = ((value * CF_MW) / 1000) * EF_GE;

      } else if(unit === 'LKR'){
        console.log('yyyy',data.year)

          let tariffFacs =  await this.tariffService.getMunicipalWaterTariffFac(data.year, [data.category]);
          console.log("tariffFacs",tariffFacs)
          let usage_charge = tariffFacs.usageCharge; //116;
          let vat = tariffFacs.vat;

          if ( tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_1 && data.consumption <= tariffFacs.upperLevel_1){
            monServiceCharge = tariffFacs.monthlyServiceCharge_1;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_2 && data.consumption <= tariffFacs.upperLevel_2){
            monServiceCharge = tariffFacs.monthlyServiceCharge_2;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_3 && data.consumption <= tariffFacs.upperLevel_3){
            monServiceCharge = tariffFacs.monthlyServiceCharge_3;
            console.log("l3",monServiceCharge)
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_4 && data.consumption <= tariffFacs.upperLevel_4){
            monServiceCharge = tariffFacs.monthlyServiceCharge_4;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_5 && data.consumption <= tariffFacs.upperLevel_5){
            monServiceCharge = tariffFacs.monthlyServiceCharge_5;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_6 && data.consumption <= tariffFacs.upperLevel_6){
            monServiceCharge = tariffFacs.monthlyServiceCharge_6;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_7 && data.consumption <= tariffFacs.upperLevel_7){
            monServiceCharge = tariffFacs.monthlyServiceCharge_7;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_8 && data.consumption <= tariffFacs.upperLevel_8){
            monServiceCharge = tariffFacs.monthlyServiceCharge_8;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_9 && data.consumption <= tariffFacs.upperLevel_9){
            monServiceCharge = tariffFacs.monthlyServiceCharge_9;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_10 && data.consumption <= tariffFacs.upperLevel_10){
            monServiceCharge = tariffFacs.monthlyServiceCharge_10;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_11 && data.consumption <= tariffFacs.upperLevel_11){
            monServiceCharge = tariffFacs.monthlyServiceCharge_11;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_12 && data.consumption <= tariffFacs.upperLevel_12){
            monServiceCharge = tariffFacs.monthlyServiceCharge_12;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_13 && data.consumption <= tariffFacs.upperLevel_13){
            monServiceCharge = tariffFacs.monthlyServiceCharge_13;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_14 && data.consumption <= tariffFacs.upperLevel_14){
            monServiceCharge = tariffFacs.monthlyServiceCharge_14;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_15 && data.consumption <= tariffFacs.upperLevel_15){
            monServiceCharge = tariffFacs.monthlyServiceCharge_15;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_16 && data.consumption <= tariffFacs.upperLevel_16){
            monServiceCharge = tariffFacs.monthlyServiceCharge_16;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_17 && data.consumption <= tariffFacs.upperLevel_17){
            monServiceCharge = tariffFacs.monthlyServiceCharge_17;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_18 && data.consumption <= tariffFacs.upperLevel_18){
            monServiceCharge = tariffFacs.monthlyServiceCharge_18;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_19 && data.consumption <= tariffFacs.upperLevel_19){
            monServiceCharge = tariffFacs.monthlyServiceCharge_19;
          }else if (tariffFacs != -1 && data.consumption > tariffFacs.lowerLevel_20 && data.consumption <= tariffFacs.upperLevel_20){
            monServiceCharge = tariffFacs.monthlyServiceCharge_20;
          }else {
            monServiceCharge = tariffFacs.defaultMonthlyServiceCharge;
          }

          console.log("monthlyServiceCharge",monServiceCharge)
          // if (data.consumption >= 336 && data.consumption < 3584){
          //   monServiceCharge = 300;
          // }else if (data.consumption >= 3584 && data.consumption < 7140){
          //   monServiceCharge = 575;
          // }else if (data.consumption >= 7140 && data.consumption < 11032){
          //   monServiceCharge = 1150;
          // }else if (data.consumption >= 11032 && data.consumption < 14280){
          //   monServiceCharge = 1150;
          // }else if (data.consumption >= 14280 && data.consumption < 28044.80){
          //   monServiceCharge = 1840;
          // }else if (data.consumption >= 28044.80 && data.consumption < 68180){
          //   monServiceCharge = 2875;
          // }else if (data.consumption >= 68180 && data.consumption < 135072){
          //   monServiceCharge = 4600;
          // }else if (data.consumption >= 135072 && data.consumption < 269500){
          //   monServiceCharge = 8625;
          // }else if (data.consumption >= 269500 && data.consumption < 535780){
          //   monServiceCharge = 14375;
          // }else if (data.consumption >= 535780 && data.consumption < 1331400){
          //   monServiceCharge = 28750;
          // }else if (data.consumption >= 1331400 && data.consumption < 2662800){
          //   monServiceCharge = 57500;
          // }else {
          //   monServiceCharge = 115000;
          // }

          //e_mw = ((data.consumption / 1.12) - monServiceCharge) / usage_charge ;
          e_mw = ((((data.consumption / (vat/100)) - monServiceCharge) / usage_charge)*CF_MW*EF_GE)/1000;

          console.log("data",{

            c:data.consumption ,
            vat:vat,
            monServiceCharge:monServiceCharge,
            usage_charge:usage_charge,
            CF_MW:CF_MW,
            EF_GE:EF_GE
          })

          console.log("sss",e_mw)
          
        //  ((((10778.7 / (112/100)) - 7657664) / 116)*0.35*0.5422)/1000
      
          


      }

      // switch (data.unit) {
      //   case "m3": {
      //     e_mw = ((value * cf_mw) / 1000) * EF_GE;
      //         break;
      //         }
    
      //     case "LKR":{
      //       e_mw = 0;
      //         break;
      //         }
    
      //     case "l":{
      //       e_mw = 0;
      //       break;
      //       }
    

    
      //     default:{
      //       e_mw = 0;
      //         }
    
      //   }
    
        let response = new emissionCalResDto();
        response.e_sc = e_mw;
        response.e_sc_ch4 = 0;
        response.e_sc_co2 = 0;
        response.e_sc_n2o = 0;
        
        return response;
    
 
    
      
      
      }
  
}
