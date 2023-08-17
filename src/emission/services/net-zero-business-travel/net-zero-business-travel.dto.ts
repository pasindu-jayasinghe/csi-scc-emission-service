import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class NetZeroBusinessTravelDto{
    
    month: number;

   
    year: number;

   
    method: string;

    data:VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData | HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData|AmountSpendBasedNetZeroBusinessTravelEmissionSourceData|FuelFuelBasedNetZeroBusinessTravelEmissionSourceData|GridFuelBasedNetZeroBusinessTravelEmissionSourceData|RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData;


    groupNumber:string;
    emission: number;

    baseData: BaseDataDto;  
}

export class FuelFuelBasedNetZeroBusinessTravelEmissionSourceData {
  id:number;
  typeName: string;
 
    fuel_type: string;
    fuel_quntity_unit: string;
    quntity:number;
    }
    export class GridFuelBasedNetZeroBusinessTravelEmissionSourceData {
      id:number;
      typeName: string;
   
      grid_type: string;
      grid_quntity_unit: string;
      quntity:number;
    }
    export class RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData {
      id:number;
    typeName: string;
 
    refrigerant_type: string;
  
    quntity:number;
    refrigerant_quntity_unit: string;
    }
   
export class VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData {
  id:number;
    typeName: string;
    vehicleType: string;
  
    totalDistanceTravelled: number;
  
    totalDistanceTravelled_unit: string;
  
    
  }
  export class HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData {
   
  
    id:number;
    typeName: string;
    countryID:number;
    totalNumberHotelNight: number;
    user_input_ef:number 
   
  }

  export class AmountSpendBasedNetZeroBusinessTravelEmissionSourceData {
    
    id:number;
    travel_type:string;
    totalAmountOnTravel: number;
    totalAmountOnTravel_unit: string;
    user_input_ef:number 
  }

  export enum NetZeroBusinessTravelEmissionSourceDataTypeNames {
   
    Fuel='Fuel',
    Grid='Grid',
    Ref='Ref',
    Hotel='Hotel',
    Distance='Distance',
  
   
  }