import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { DefraService } from 'src/emission/emission-factors/defra.service';
import { IncinerationService } from 'src/emission/emission-factors/incineration.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { wasteDisposalDto } from './waste-disposal.dto';
import { WasteDisposal, WasteDisposalMethod } from './waste-disposal.enum';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';


@Injectable()
export class WasteDisposalService implements Iso14064Service, GHGProtocolService  {

    constructor(
      private service: DefraService,
      private conversionService: UnitConversionService,
      private incinerationService: IncinerationService,
      private commonEmissionFactorService: CommonEmissionFactorService,
    ) { }

  calculationGHGProtocol(data: any) {
    throw new Error('Method not implemented.');
  }

    async calculationIso14064(data: wasteDisposalDto) {

       let {PIGGERY_FEEDRATE} = await this.commonEmissionFactorService.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.PIGGERY_FEEDRATE] );
        
        let months : number;
        let EWD_xz : number;
        let EF_wxz: number;
        let carbonFraction: number;
        let dryMatter: number;
        let fossilCarbonFraction: number;
        let oxidationFactor: number;
        let ef_ch4: number;
        let ef_n2o: number;

        let wasteFactor =await this.service.getDefraFac( data.year,data.baseData.tier, [data.wasteType] );
        let incinerationFactor = await this.incinerationService.getIncinerationFac( data.year, [data.wasteType])
        //  console.log("incinerationFactor",incinerationFactor)
        //  console.log("factor",wasteFactor)
         console.log("data",data)
        //  console.log("piggeryFeedrate",PIGGERY_FEEDRATE)

        let unit = ParamterUnit.waste_disposal_unit
        let value = data.amountDisposed


        switch (data.disposalMethod){

          case WasteDisposalMethod.RE_USE:{
            EF_wxz = wasteFactor.reUse;
              break;
          }

          case WasteDisposalMethod.OPEN_LOOP:{
            EF_wxz = wasteFactor.openLoop;
              break;
          }

          case WasteDisposalMethod.CLOSED_LOOP:{
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

        let dataUnit = data.amountDisposedUnit

        if (dataUnit !== unit){
          value = this.conversionService.convertUnit(value, dataUnit, unit).value
        }

        if (data.disposalMethod === WasteDisposalMethod.INCINERATION){
           
          let e1 = data.amountDisposed*(dryMatter/100)*(carbonFraction/100)*(fossilCarbonFraction/100)*(oxidationFactor/100);
          let e2 = data.amountDisposed*ef_ch4;
          let e3 = data.amountDisposed*ef_n2o;
          response.e_sc_co2 = 0;
          response.e_sc_ch4 = e2;
          response.e_sc_n2o = e3;
          response.e_sc = e1 + e2 + e3;

        }else if (data.disposalMethod === WasteDisposalMethod.PIGGERY_FEEDING){

          let e1 = (data.amountDisposed * 1000/ (PIGGERY_FEEDRATE * (365 / months)));
          let e2 = (((( 7 / months) * (Math.ceil(e1))) / 1000) * 28);

          response.e_sc_co2 = 0;
          response.e_sc_ch4 = e2;
          response.e_sc_n2o = 0;
          response.e_sc =  e2;

        }else{

          EWD_xz = (value*EF_wxz)/1000

          response.e_sc = EWD_xz;
          response.e_sc_ch4 = 0;
          response.e_sc_co2 = EWD_xz;
          response.e_sc_n2o = 0;

        }

        console.log("response",response)
            
        return response; 
       
      
      
      }
  
}












        // switch (data.disposalMethod + "|" + data.wasteType){

        //   case "Re-use|"+WasteDisposal.AVERAGE_CONSTRUCTION:{
        //     EF_wxz = wasteFactor.reUse;
        //       break;
        //       }

        //   case "Re-use|"+WasteDisposal.TYRES:{
        //     EF_wxz =wasteFactor.reUse;
        //       break;
        //       }
          
        //   case "Re-use|"+WasteDisposal.WOODS:{
        //     EF_wxz =wasteFactor.reUse;
        //       break;
        //       }
          
        //   case "Open loop|"+WasteDisposal.AVERAGE_CONSTRUCTION:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.TYRES:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }
          
        //   case "Open loop|"+WasteDisposal.WOODS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.GLASS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.MUNICIPAL_WASTE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.WEEE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.WEEE_FRIDGES_AND_FREEZERS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.BATTERIES:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.PLASTIC:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }





        //   case "Open loop|"+WasteDisposal.AGGREGATES:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.ASPHALT:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }
        //   case "Open loop|"+WasteDisposal.BRICKS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.CONCRETE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.WEEE_LARGE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.WEEE_MIXED:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.WEEE_SMALL:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.METAL_ALUMINIUMCANS_FOIL:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.METAL_MIXED_CANS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.METAL_SCRAP_METAL:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.METAL_STEEL_CANS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.PLASTICS_AVERAGE_PLASTICS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //       }

        //   case "Open loop|"+WasteDisposal.PLASTICS_AVERAGE_PLASTIC_FILM:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_AVERAGE_PLASTIC_RIGID:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_HDPE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_LDPE_LLDPE:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_PET:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_PP:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_PS:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }

        //   case "Open loop|"+WasteDisposal.PLASTICS_PVC:{
        //     EF_wxz = wasteFactor.openLoop;
        //       break;
        //   }


        //   case "Closed-loop|"+WasteDisposal.AVERAGE_CONSTRUCTION:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.SOILS:{
        //     EF_wxz =wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.TYRES:{
        //     EF_wxz =wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.WOOD:{
        //     EF_wxz =wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.BOOKS:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.GLASS:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.CLOTHING:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|" + WasteDisposal.MUNICIPAL_WASTE:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.COMMERCIAL_AND_INDUSTRIAL_WASTE:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.METAL:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.PLASTIC:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Closed-loop|"+WasteDisposal.PAPER_AND_BOARD:{
        //     EF_wxz = wasteFactor.closedLoop;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.WOOD:{
        //     EF_wxz = wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.BOOKS:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //     }

        //   case "Combusion|"+WasteDisposal.GLASS:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.CLOTHING:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.MUNICIPAL_WASTE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.ORGANIC_FOOD_AND_DRINK_WASTE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.ORGANIC_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.COMMERCIAL_AND_INDUSTRIAL_WASTE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.WEEE:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.METAL:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Combusion|"+WasteDisposal.PLASTIC:{
        //     EF_wxz =wasteFactor.combution;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.WOOD:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.BOOKS:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.ORGANIC_FOOD_AND_DRINK_WASTE:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.ORGANIC_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Composting|"+WasteDisposal.PAPER_AND_BOARD:{
        //     EF_wxz =wasteFactor.composting;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.SOILS:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.BOOKS:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.GLASS:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.CLOTHING:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.MUNICIPAL_WASTE:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.ORGANIC_FOOD_AND_DRINK_WASTE:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.ORGANIC_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.WEEE:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.WEEE_FRIDGES_AND_FREEZERS:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.BATTERIES:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.METAL:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.PLASTIC:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Landfill|"+WasteDisposal.PAPER_AND_BOARD:{
        //     EF_wxz =wasteFactor.landFill;
        //       break;
        //       }

        //   case "Anaerobic digestion|"+WasteDisposal.MUNICIPAL_WASTE:{
        //     EF_wxz =wasteFactor.AnaeriobicDigestions;
        //       break;
        //       }

        //   case "Anaerobic digestion|"+WasteDisposal.ORGANIC_FOOD_AND_DRINK_WASTE:{
        //     EF_wxz =wasteFactor.AnaeriobicDigestions;
        //       break;
        //       }

        //   case "Anaerobic digestion|"+WasteDisposal.ORGANIC_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.AnaeriobicDigestions;
        //       break;
        //       }

        //   case "Anaerobic digestion|"+WasteDisposal.ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE:{
        //     EF_wxz =wasteFactor.AnaeriobicDigestions;
        //       break;
        //       }

        //   case "Anaerobic digestion|"+WasteDisposal.COMMERCIAL_AND_INDUSTRIAL_WASTE:{
        //     EF_wxz =wasteFactor.AnaeriobicDigestions;
        //       break;
        //       }

        //   case "Piggery Feeding|"+WasteDisposal.WASTE:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.PAPER_CARDBOARD:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.TEXTILE:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.FOOD_WASTE:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.WOOD:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.GARDEN_AND_PARK_WASTE:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.NAPPIES:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.RUBBER_AND_LEATHER:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.PLASTICS:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.OTHER_WASTES:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.DOMESTIC:{
        //     EF_wxz =100;
        //       break;
        //       }

        //   case "Incineration|"+WasteDisposal.INDUSTRIAL:{
        //     EF_wxz =100;
        //       break;
        //       }
  
    

    
        //   default:{
            
        //       }
    
        // }