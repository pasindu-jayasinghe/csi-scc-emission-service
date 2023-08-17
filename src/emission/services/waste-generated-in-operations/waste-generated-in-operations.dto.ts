import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class WasteGeneratedInOperationsDto{
    
    month: number;

   
    year: number;

   
    method: string;

    data:WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData|ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData| WasteAverageDataWasteGeneratedInOperationsEmissionSourceData;

    groupNumber:string;
    emission: number;

    baseData: BaseDataDto;  
}


export class ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData {
  id:number;
 
 
    company: string;
    scpoeOne: number;
    scpoeOne_unit:string;
    scpoeTwo:number;
    scpoeTwo_unit:string;
  }
  export class WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData {
    id:number;
    wasteType: string;
    wasteTypeEF: number;
    disposalType: string;
    wasteProdused: number;
    wasteProdused_unit: string; 
   
    
  }
  export class WasteAverageDataWasteGeneratedInOperationsEmissionSourceData {
    id:number;
    treatmentMethod:string;
    treatmentMethodEF:number
    massOfWaste: number;
    massOfWaste_unit: string;
    proportionOfWaste: number;
   
    
    // user_input_ef:number
  }
  export enum WasteGeneratedInOperationsEmissionSourceDataTypeNames {
   
    SCOPE='scope',
    WASTE='waste',
    AVERAGE='average',
    
  
   
  }