import { Injectable } from '@nestjs/common';
import { CommonEmissionFactor } from 'src/emission/emission-factors/common-emission-factor.entity';
import { gasBiomassDto } from './gas-biomass.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
//import { GasBiomassFactorService } from 'src/emission/emission-factors/gas-biomass-factor.service';
import { gasBiomassFactors } from 'src/emission/enum/gasBiomassFactors.enum';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class GasBiomassService implements Iso14064Service, GHGProtocolService  {

  constructor(private service: CommonEmissionFactorService) { }

  calculationGHGProtocol(data: any) {
    throw new Error('Method not implemented.');
  }


  async calculationIso14064(data: gasBiomassDto) {
    
    let te_sc:number;
    let e_sc:number;
    let ef_co2:number;
    let ef_ch4:number;
    let ef_n2o:number;
    let ncv:number;
    
    let {  ef_co2_landfill, ef_co2_sludge, ef_co2_other,
       ef_ch4_landfill, ef_ch4_sludge, ef_ch4_other, 
       ef_n2o_landfill, ef_n2o_sludge, ef_n2o_other, 
       gwp_ch4, gwp_co2, gwp_n2o,  } = await this.service.getCommonEmissionFactors(data.year, data.countryCode,
      [emissionFactors.ef_co2_landfill,
        emissionFactors.ef_co2_sludge,
        emissionFactors.ef_co2_other,
        emissionFactors.ef_ch4_landfill,
        emissionFactors.ef_ch4_sludge,
        emissionFactors.ef_ch4_other,
        emissionFactors.ef_n2o_landfill,
        emissionFactors.ef_n2o_sludge,
        emissionFactors.ef_n2o_other,
        emissionFactors.gwp_ch4,
        emissionFactors.gwp_co2,
        emissionFactors.gwp_n2o,

      ]);

      switch (data.type){
        case "LandfillGas":{

          ef_co2=ef_co2_landfill;
          ef_ch4=ef_ch4_landfill;
          ef_n2o=ef_n2o_landfill;
        //  ncv= ncv_landfill;
            
          break;
          }
  
        case "SludgeGas":{

          ef_co2=ef_co2_sludge;
          ef_ch4=ef_ch4_sludge;
          ef_n2o=ef_n2o_sludge;
        //  ncv= ncv_sludge;
            
          break;
          }
  
        case "OtherBiogas":{

          ef_co2=ef_co2_other;
          ef_ch4=ef_ch4_other;
          ef_n2o=ef_n2o_other;
      //    ncv= ncv_other;
          
          break;
          }
  
  
        default:{

          ef_co2= 0;
          ef_ch4= 0;
          ef_n2o= 0;
          ncv= 0;
            
            }
            
      
  
      }

    te_sc = (data.fcn/1000)*ncv

    e_sc = ((ef_co2*gwp_co2)/1000)*te_sc + ((ef_ch4*gwp_ch4)/1000)*te_sc + ((ef_n2o*gwp_n2o)/1000)*te_sc

    let response = new emissionCalResDto();
    response.e_sc = e_sc ;
    return  response ;
  }




}
