import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class ProcessingOfSoldProductDto {

    year: number;
    activityType: string;
    month: number;
   
    method: string;

    data: FuelSoldProductData | ElectricitySoldProductData | RefrigerantSoldProductData | WasteSoldProductData | SoldIntermediateSoldProductData ;

    groupNumber:string;
    emission: number;

    baseData: BaseDataDto;  
}

export class FuelSoldProductData {
    id: number;
    typeName: string;

    fuel_type: string;
    fuel_quntity_unit: string;
    quntity: number;
    user_input_ef: number
}

export class ElectricitySoldProductData {
    id: number;
    typeName: string;

    eletricity_type: string;
    eletricity_quntity_unit: string;
    quntity: number;
    user_input_ef: number
}

export class RefrigerantSoldProductData {
    id: number;
    typeName: string;

    refrigerant_type: string;

    quntity: number;
    refrigerant_quntity_unit: string;

}

export class WasteSoldProductData {
    id: number;
    typeName: string;

    waste_type: string;

    mass: number;
    waste_mass_unit: string;

}

export class SoldIntermediateSoldProductData {
    id: number;
    typeName: string;

    sold_intermediate_type: string;
    mass: number;
    sold_intermediate_mass_unit: string;
    user_input_ef: number
}

export enum ProcessingOfSoldProductDataTypeNames {

    Ref='Ref',
    Waste='Waste', 
    Fuel='Fuel',
    Electricity = 'Electricity',
  }
