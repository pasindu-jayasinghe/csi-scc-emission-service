import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DistanceBaseDto, FreightAirDto } from './freight-air.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class FreightAirService implements Iso14064Service, GHGProtocolService  {

    constructor(
        private conversionService: UnitConversionService
    ){}

    calculationGHGProtocol(data: FreightAirDto) {
        return this.calculationIso14064(data);
    }

    /*
     Need to clarify:
     From where to get efs(ef management or common)
     how to get CO2e? Purpose of kgCo2e? how to get totalEmission?
     */
    async calculationIso14064(data: FreightAirDto){
        let distanceWeight = 0
        if (data.mode = TransportMode.distance_base){
           distanceWeight =  this.calculateDistanceBase(data.distance)
        }

         /**TODO Need to update getFuelFactors filter for get ef  */
        let kgCo2 = 0.53358;
        let kgCH4 = 0.00004;
        let kgN2o = 0.00505;
        let kgCo2e = 0.53867;

        let response = new emissionCalResDto()
        response.e_sc_co2 = distanceWeight * kgCo2 /1000;
        response.e_sc_ch4 = distanceWeight * kgCH4 / 1000;
        response.e_sc_n2o = distanceWeight * kgN2o / 1000;
        response.e_sc = distanceWeight * kgCo2e /1000;
        // response.data = {"Co2e": distanceWeight * kgCo2e / 1000}
console.log('rrr',response)
        return response;
    }

    calculateDistanceBase(data: DistanceBaseDto){

        console.log('data---',data)
       
        let distance_unit = ParamterUnit.freight_air_distance;
        let weight_unit = ParamterUnit.freight_air_weight;

        let weight = 0;
        let distance = 0;

        let distanceUp_value = data.distanceUp;
        let weightUp_value = data.weightUp;
        let distanceUp_dataUnit = data.distanceUp_unit;
        let weightUp_dataUnit = data.weightUp_unit;

        if (distanceUp_dataUnit !== distance_unit){
            distanceUp_value = this.conversionService.convertUnit(distanceUp_value, distanceUp_dataUnit, distance_unit).value
        } 

        if (weightUp_dataUnit !== weight_unit){
            weightUp_value = this.conversionService.convertUnit(weightUp_value, weightUp_dataUnit, weight_unit).value
        }

        if (data.twoWay){
            let distanceDown_value = data.distanceDown;
            let weightDown_value = data.weightDown;
            let distanceDown_dataUnit = data.distanceDown_unit;
            let weightDown_dataUnit = data.weightDown_unit;

            if (distanceDown_dataUnit !== distance_unit){
                distanceDown_value = this.conversionService.convertUnit(distanceDown_value, distanceDown_dataUnit, distance_unit).value
            } 
    
            if (weightDown_dataUnit !== weight_unit){
                weightDown_value = this.conversionService.convertUnit(weightDown_value, weightDown_dataUnit, weight_unit).value
            }
            distance = distanceUp_value  + distanceDown_value 
            weight =  weightUp_value  + weightDown_value ;
        } else {
            distance = distanceUp_value 
            weight = weightUp_value 
        }

        console.log(weight)

        console.log(weight *(distance) * data.trips)
        return weight *(distance) * data.trips
        
    }
}
