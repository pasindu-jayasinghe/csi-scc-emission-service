import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { wasteWaterTreatmentDto } from './waste-water-treatment.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class WasteWaterTreatmentService implements Iso14064Service, GHGProtocolService  {

  constructor(
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService
  ) { }

  calculationGHGProtocol(data: wasteWaterTreatmentDto) {
    return this.calculationIso14064(data);
  }

    async calculationIso14064(data: wasteWaterTreatmentDto) {

      let emission1 : number;
      let emission2 : number;
      let tco2e : number;
      let tch4 : number;
      let ef : number;
      let tcod: number;
      let mcf : number;

      let tip_unit = ParamterUnit.waste_water_tip
      let wasteGenerated_unit = ParamterUnit.waste_water_wasteGenerated
      let cod_unit = ParamterUnit.waste_water_cod
      let sludgeRemoved_unit = ParamterUnit.waste_water_sludgeRemoved
      let recoveredCh4_unit = ParamterUnit.waste_water_recoveredCh4

      let tipVal = data.tip
      let wasteGeneratedVal = data.wasteGenerated
      let codVal = data.cod
      let sludgeRemovedVal = data.sludgeRemoved
      let recoveredCh4Val = data.recoveredCh4


       mcf = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
        [emissionFactors[data.anaerobicDeepLagoon]]);

      //  switch (data.anaerobicDeepLagoon){
      //   case "Sea, River and lake discharge":{

      //       mcf = mcf_Sea_River;
            
      //     break;
      //     }
  
      //   case "Aerobic treatment plant with well managed":{

      //     mcf = mcf_A_T_P_Well_Managed;
            
      //     break;
      //     }
  
      //   case "Aerobic treatment plant without well managed":{

      //       mcf = mcf_A_T_P_Not_Well_Managed;
      //     break;
      //     }

      //   case "Anaerobic digester for sludge":{

      //       mcf = mcf_A_D_Sludge;
      //       break;
      //       }

      //   case "Anaerobic Reactor":{

      //       mcf = mcf_Anaerobic_Reactor;
      //       break;
      //       }

      //   case "Anaerobic shallow lagoon":{

      //       mcf = mcf_Anaerobic_Shallow_Lagoon;
      //       break;
      //       }

      //   case "Anaerobic deep lagoon":{

      //       mcf = mcf_Anaerobic_Deep_Lagoon;
      //       break;
      //       }
  
      //   default:{

      //     mcf = 0;
            
      //       }
            
      // }

      let tipUnit = data.tip_unit
      let codUnit = data.cod_unit
      let wasteGeneratedUnit = data.wasteGenerated_unit
      let sludgeRemovedUnit = data.sludgeRemoved_unit
      let recoveredCh4Unit = data.recoveredCh4_unit

      if (tipUnit !== tip_unit){
        tipVal = this.conversionService.convertUnit(tipVal, tipUnit, tip_unit).value
      }
      if (codUnit !== cod_unit){
        codVal = this.conversionService.convertUnit(codVal, codUnit, cod_unit).value
      }
      if (wasteGeneratedUnit !== wasteGenerated_unit){
        wasteGeneratedVal = this.conversionService.convertUnit(wasteGeneratedVal, wasteGeneratedUnit, wasteGenerated_unit).value
      }
      if (sludgeRemovedUnit !== sludgeRemoved_unit){
        sludgeRemovedVal = this.conversionService.convertUnit(sludgeRemovedVal, sludgeRemovedUnit, sludgeRemoved_unit).value
      }
      if (recoveredCh4Unit !== recoveredCh4_unit){
        recoveredCh4Val = this.conversionService.convertUnit(recoveredCh4Val, recoveredCh4Unit, recoveredCh4_unit).value
      }

      tcod = (tipVal * wasteGeneratedVal * codVal);

      ef = mcf[data.anaerobicDeepLagoon] * 0.25;

      tch4 = ((tcod - sludgeRemovedVal) * ef) - recoveredCh4Val;


      if(tch4<0){
        tch4 = 0;
      }else{
        tch4 = tch4;
      }

      if (tch4 > 0){
        tco2e = (tch4/1000)*28;
      } else {
        tco2e = 0
      }

      
      var emission ={tcod: tcod, ef: ef, tch4: tch4, tco2e: tco2e};

      let response = new emissionCalResDto();
      response.e_sc = tch4+tco2e;
      response.e_sc_ch4 = tch4;
      response.e_sc_co2 = tco2e;
      response.e_sc_n2o = 0;
      response.data = JSON.stringify(emission);

      console.log(response)
          
      return response; 

    }

}
