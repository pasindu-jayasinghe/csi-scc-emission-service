import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class CapitalGoodsDto {

  month: number;

  year: number;

  // method: string;

  data: capitalGoodData 

  groupNumber: string;

  emission: number;

  baseData: BaseDataDto;
}
export class capitalGoodData {
  id: number;
  type_of_cg: string;
  category:string;
  quantity:number| null;
  user_input_ef:number | null;
  user_input_ef_unit: string;
  quantity_unit:string;
  
}




