import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { TransportService } from 'src/emission/emission-factors/transport.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';

import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';



import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { WasteGeneratedInOperationsDto } from './waste-generated-in-operations.dto';
import { WasteGeneratedInOperationsMethod } from 'src/emission/enum/wasteGeneratedInOperationsMethod.enum';
import { IncinerationService } from 'src/emission/emission-factors/incineration.service';
import { DefraService } from 'src/emission/emission-factors/defra.service';
import { months } from 'moment';
import { WasteDisposalMethod } from '../waste-disposal/waste-disposal.enum';


@Injectable()
export class WasteGeneratedInOperationsService
  implements Iso14064Service, GHGProtocolService
{
  public gwp_co2: number;
  public gwp_ch4: number;
  public gwp_n2o: number;
  public currencies = currencies;

  constructor(
    private netZeroFactorService: NetZeroFactorService,
    private defraService: DefraService,
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService,
      private incinerationService: IncinerationService,
   
  ) {}

  calculationIso14064(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationGHGProtocol(data: WasteGeneratedInOperationsDto) {
    let energy = 0;
    let response = new emissionCalResDto();
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

    this.gwp_co2 = gwp_co2;
    this.gwp_ch4 = gwp_ch4;
    this.gwp_n2o = gwp_n2o;

    if (data.method === WasteGeneratedInOperationsMethod.SUPPLIER) {
      response = await this.calculateSupplierBase(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    } else if (data.method === WasteGeneratedInOperationsMethod.WASTE) {
      response = await this.calculateWasteBase(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    
    } else {
      response = await this.calculateAverageData(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    }

    return response;
  }



  async calculateSupplierBase(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
 

    let response = new emissionCalResDto();

  
      let co2 = 0;
      let ch4 = 0;
      let n2o = 0;
      let total = 0;
      let { gwp_co2, gwp_ch4, gwp_n2o } =
        await this.service.getCommonEmissionFactors(
          data.year,
          baseData.countryCode,
          [
            emissionFactors.gwp_co2,
            emissionFactors.gwp_ch4,
            emissionFactors.gwp_n2o,
          ],
        );
      console.log('gwp_co2, gwp_ch4, gwp_n2o', gwp_co2, gwp_ch4, gwp_n2o);
      let unit = ParamterUnit.waste_generated_in_operations_scope;
      let scopeOne = data.scpoeOne;
      let scpoeOne_unit = data.scpoeOne_unit;
      let scpoeTwo = data.scpoeTwo;
      let scpoeTwo_unit = data.scpoeTwo_unit;

      if (scpoeOne_unit !== unit) {
        scopeOne = this.conversionService.convertUnit(scopeOne, scpoeOne_unit, unit).value;
      }
      if (scpoeTwo_unit !== unit) {
        scpoeTwo = this.conversionService.convertUnit(scpoeTwo, scpoeTwo_unit, unit).value;
      }
    
      response.e_sc = scopeOne + scpoeTwo;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;

    // console.log(response);
    return response;
  }

  async calculateWasteBase(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
  

    let response = new emissionCalResDto();

  
    let unit='';
    let dataUnit = data.wasteProdused_unit
      let wasteProdused = data.wasteProdused;
     
     if(data.wasteType){
       unit = ParamterUnit.waste_generated_in_operations_waste_produced_solid;
      if(!data.wasteTypeEF){
        let {PIGGERY_FEEDRATE} = await this.service.getCommonEmissionFactors(year, baseData.countryCode, [emissionFactors.PIGGERY_FEEDRATE] );
  
        let months : number;
        let EWD_xz : number;
        let EF_wxz: number;
        let carbonFraction: number;
        let dryMatter: number;
        let fossilCarbonFraction: number;
        let oxidationFactor: number;
        let ef_ch4: number;
        let ef_n2o: number;
        let wasteFactor =await this.defraService.getDefraFac( data.year,baseData.tier, [data.wasteType] );
        let incinerationFactor = await this.incinerationService.getIncinerationFac( data.year, [data.wasteType])
        
         console.log("data1wqeqeqwe",data,wasteFactor,incinerationFactor)
       
  
       
        
  
  
        switch (data.disposalType){
  
          case WasteDisposalMethod.RE_USE:{
            EF_wxz = wasteFactor.reUse;
              break;
          }
  
          case WasteDisposalMethod.OPEN_LOOP:{
            EF_wxz = wasteFactor.openLoop;
              break;
          }
  
          case WasteDisposalMethod.CLOSED_LOOP:{
            console.log('asdefbechu')
            EF_wxz = wasteFactor.closedLoop;
              break;
          }
  
          case WasteDisposalMethod.COMBUSION:{
            EF_wxz = wasteFactor.combution;
              break;
          }
  
          case WasteDisposalMethod.COMPOSTING:{
            EF_wxz = wasteFactor.composting;
              break;
          }
  
          case WasteDisposalMethod.LANDFILL:{
            EF_wxz = wasteFactor.landFill;
              break;
          }
  
          case WasteDisposalMethod.ANAEROBIC_DIGESTION:{
            EF_wxz = wasteFactor.AnaeriobicDigestions;
              break;
          }
  
          case WasteDisposalMethod.PIGGERY_FEEDING:{
  
            if(data.month === 12) {
              months = 1;
            }else{
              months = 12;
            }
  
            //EF_wxz = wasteFactor.PiggeryFeeding;
              break;
          }
  
          case WasteDisposalMethod.INCINERATION:{
            carbonFraction = incinerationFactor.carbonFraction;
            dryMatter = incinerationFactor.dryMatter;
            fossilCarbonFraction = incinerationFactor.fossilCarbonFraction;
            oxidationFactor = incinerationFactor.oxidationFactor;
            ef_ch4 = incinerationFactor.ef_ch4;
            ef_n2o = incinerationFactor.ef_n2o;
  
            //EF_wxz = wasteFactor.Incineration;
              break;
          }
  
          default:{
            
            EF_wxz = 0;
                   }
  
        } 
  
  
        
        let response = new emissionCalResDto();
  
        
  
        if (dataUnit !== unit){
          wasteProdused = this.conversionService.convertUnit(wasteProdused, dataUnit, unit).value
        }
  
        if (data.disposalType === WasteDisposalMethod.INCINERATION){
           
          let e1 = wasteProdused*(dryMatter/100)*(carbonFraction/100)*(fossilCarbonFraction/100)*(oxidationFactor/100);
          let e2 = wasteProdused*ef_ch4;
          let e3 = wasteProdused*ef_n2o;
          response.e_sc_co2 = 0;
          response.e_sc_ch4 = e2;
          response.e_sc_n2o = e3;
          response.e_sc = e1 + e2 + e3;
  
        }else if (data.disposalType === WasteDisposalMethod.PIGGERY_FEEDING){
  
          let e1 = (wasteProdused * 1000/ (PIGGERY_FEEDRATE * (365 / months)));
          let e2 = (((( 7 / months) * (Math.ceil(e1))) / 1000) * 28);
  
          response.e_sc_co2 = 0;
          response.e_sc_ch4 = e2;
          response.e_sc_n2o = 0;
          response.e_sc =  e2;
  
        }else{
  console.log('EWD_xz',EF_wxz,wasteProdused)
          EWD_xz = (wasteProdused*EF_wxz)/1000
  
          response.e_sc = EWD_xz;
          response.e_sc_ch4 = 0;
          response.e_sc_co2 = EWD_xz;
          response.e_sc_n2o = 0;
  
        }
  
        console.log("response",response)
            
        return response; 
      }
        

     }else if(data.treatmentMethod){
      console.log('data.treatmentMethod')
       unit = ParamterUnit.waste_generated_in_operations_waste_produced_water;
      if(!data.wasteTypeEF){

        let ef = 0;
        
          let teartmentef = await this.service.getCommonEmissionFactors(year, baseData.countryCode,
            [emissionFactors[data.treatmentMethod]]);
            data.wasteTypeEF=teartmentef[emissionFactors[data.treatmentMethod]]; 
           console.log('ef2',ef,emissionFactors[data.treatmentMethod],teartmentef[emissionFactors[data.treatmentMethod]])
    

        
      }


     }
     dataUnit = data.wasteProdused_unit
  
     if (dataUnit !== unit){
       wasteProdused = this.conversionService.convertUnit(wasteProdused, dataUnit, unit).value
     }
     response.e_sc = wasteProdused *  data.wasteTypeEF;
     response.e_sc_ch4 = 0;
     response.e_sc_co2 = 0;
     response.e_sc_n2o = 0;
   
   return response;
   
  }
  async calculateAverageData(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
    // let ef = data.user_input_ef ? data.user_input_ef : 0;
    
    let response = new emissionCalResDto();
    let unit = ParamterUnit.waste_generated_in_operations_mass_waste;
  
    let massOfWaste = data.massOfWaste;
    let massOfWaste_unit = data.massOfWaste_unit;
    let proportionOfWaste = data.proportionOfWaste;
    let ef = 0;
    if(!data.treatmentMethodEF){
      let teartmentef = await this.service.getCommonEmissionFactors(year, baseData.countryCode,
        [emissionFactors[data.treatmentMethod]]);
        data.treatmentMethodEF=teartmentef[emissionFactors[data.treatmentMethod]]; 
       console.log('ef2',ef,emissionFactors[data.treatmentMethod],teartmentef[emissionFactors[data.treatmentMethod]])
    }
  

    if (massOfWaste_unit !== unit){
      massOfWaste = this.conversionService.convertUnit(massOfWaste, massOfWaste_unit, unit).value
    }
    response.e_sc = massOfWaste *proportionOfWaste* data.treatmentMethodEF;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
    return response;
  }
  /* Employee Commuting calculation */

 

  
}
