import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class NetZeroEmployeeCommutingDto{
    
    month: number;

   
    year: number;

   
    method: string;

    data:VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData | EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData|EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData|FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData|GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData|RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData;


    groupNumber:string;
    emission: number;

    baseData: BaseDataDto;  
}

export class FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData {
    id:number;
    typeName: string;
    fuel_type: string;
    fuel_quntity_unit: string;
    quntity:number;
    }

    export class GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData {
      id:number;
      typeName: string;
      grid_type: string;
      grid_quntity_unit: string;
      quntity:number;
    }

    export class RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData {
    id:number;
    typeName: string;
    refrigerant_type: string;
    quntity:number;
    refrigerant_quntity_unit: string;
    }
   
    export class VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData {
      id:number;
      typeName: string;
      vehicleType: string;
    
      totalDistanceTravelled: number;
   
      totalDistanceTravelled_unit: string; 
      commutingDaysPerYear: number;
      
    }

  export class EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData {
    id:number;
    typeName: string;
    energy_source: string;
    energy: number;
    energy_unit:string;
    user_input_ef:number  
   
  } 
 

  export class EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData {
    id:number;
    travel_type:string;
    workingDayPerYear: number;
    oneWayDistance: number;
    oneWayDistance_unit: string;
    numberOfEmplyees: number;
    presentageUsingVehcleType: number;
    // user_input_ef:number
  }

  
  export enum NetZeroEmployeeCommutingEmissionSourceDataTypeNames {
   
    Fuel='Fuel',
    Grid='Grid',
    Ref='Ref',
    Energy='Energy',
    Distance='Distance',
    Employee='Employee',
  
  
   
  }