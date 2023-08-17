import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { refrigerantDto } from './refrigerant.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class RefrigerantService implements Iso14064Service, GHGProtocolService  {

  constructor(
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService
  ) { } 
  async calculationGHGProtocol(data: any) {
   console.log("HHHHHH",data)

    let E_RL:number;
    let GWP_RG_Val : number;

    let W_RG_unit = ParamterUnit.refrigerant_W_RG
    let value = data.W_RG

    let {GWP_RG_R407C} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R407C] );
    let {GWP_RG_R410A} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R410A] );
    let {GWP_RG_R22} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R22] );
    let {GWP_RG_R134a} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R134a] );

    //console.log(GWP_RG_R407C,GWP_RG_R410A,GWP_RG_R22,GWP_RG_R134a)
    switch (data.GWP_RG){
      case "R407C":{
          GWP_RG_Val = GWP_RG_R407C;
          break;
          }

      case "R410A":{
          GWP_RG_Val = GWP_RG_R410A
          break;
          }

      case "R22":{
        GWP_RG_Val = GWP_RG_R22
        break;
        }

      case "R134a":{
        GWP_RG_Val = GWP_RG_R134a
        break;
        }

      default:{
          GWP_RG_Val=0
          }
    }

    let dataUnit = data.W_RG_Unit

    if (dataUnit !== W_RG_unit){
       value = this.conversionService.convertUnit(value, dataUnit, W_RG_unit).value
    }
    
    switch (data.activityType){
      case "INSTALL":{
        E_RL = (value/1000)* (data.assembly_Lf/100)*GWP_RG_Val
        console.log("aaa",E_RL)
        break;
          }

      case "OPERATION":{
        E_RL = (value/1000)* (data.annual_lR/100)*data.time_R * GWP_RG_Val
          break;
          }

      case "DISPOSAL":{
        E_RL = (value/1000)* (data.p_capacity/100)*(1-data.p_r_recover/100) * GWP_RG_Val
        break;
        }

      case "REFILL":{
        E_RL = (value/1000)*GWP_RG_Val
        break;
        }

      default:{
        E_RL = (value/1000)*GWP_RG_Val
      }
    }

    // E_RL = (value/1000)*GWP_RG_Val

    let response = new emissionCalResDto();
    response.e_sc = E_RL;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
        
    return response;  }

  async calculationIso14064(data: refrigerantDto) {

    let E_RL:number;
    let GWP_RG_Val : number;

    let W_RG_unit = ParamterUnit.refrigerant_W_RG
    let value = data.W_RG

    let {GWP_RG_R407C} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R407C] );
    let {GWP_RG_R410A} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R410A] );
    let {GWP_RG_R22} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R22] );
    let {GWP_RG_R134a} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.GWP_RG_R134a] );

    //console.log(GWP_RG_R407C,GWP_RG_R410A,GWP_RG_R22,GWP_RG_R134a)
    switch (data.GWP_RG){
      case "R407C":{
          GWP_RG_Val = GWP_RG_R407C;
          break;
          }

      case "R410A":{
          GWP_RG_Val = GWP_RG_R410A
          break;
          }

      case "R22":{
        GWP_RG_Val = GWP_RG_R22
        break;
        }

      case "R134a":{
        GWP_RG_Val = GWP_RG_R134a
        break;
        }

      default:{
          GWP_RG_Val=0
          }
    }

    let dataUnit = data.W_RG_Unit

    if (dataUnit !== W_RG_unit){
       value = this.conversionService.convertUnit(value, dataUnit, W_RG_unit).value
    }

    E_RL = (value/1000)*GWP_RG_Val

    let response = new emissionCalResDto();
    response.e_sc = E_RL;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
        
    return response;
    
  }


}


