import { BaseDataDto } from "src/emission/dto/emission-base-data.dto"
import { emissionFactors } from "src/emission/enum/emissionFactors.enum"
import { fuelType } from "src/emission/enum/fuelType.enum"
import { UseOfSoldProductsMethod } from "src/emission/enum/net-zero-use-of-sold-products.enum"

export class UseOfSoldProductsDto {
    mode: UseOfSoldProductsMethod
    data: FuelData | ElectricityData | RefrigerantData | CombustedData | GreenhouseData | IndirectFuelData | IndirectElectricityData | IndirectRefrigerantdata | IndirectGHGData | IntermediateData
    year: number
    baseData: BaseDataDto
}

export class FuelData{
    id:number;
    typeName: string;
    fuel_type:string;
    fuel_lifetime: number;
    fuel_number_of_sold: number;
    fuel_consumption: number;
    fuel_consumption_unit: string;
} 

export class ElectricityData {
    id:number;
    typeName: string; 
    elec_lifetime: number;
    elec_number_of_sold: number;
    elec_consumption: number
    elec_consumption_unit: string;
}

export class RefrigerantData {
    id:number;
    typeName: string;
    ref_type: string;
    ref_lifetime: number;
    ref_number_of_sold: number;
    ref_leakage: number
    ref_leakage_unit: string;
}

export class CombustedData {
    id:number;
    typeName: string;
    fuel_type: string;
    total_quantity: number;
    total_quantity_unit: string;;

}
export class GreenhouseData {
    id:number;
    typeName: string;
    ghg_type:emissionFactors;
    ghg_amount: number;
    ghg_amount_unit: string;;
    number_of_products: number;
    percentage_of_released: number;
}

export class IndirectFuelData {
    id:number;
    typeName: string;
    fuel_type: fuelType;
    indir_fuel_lifetime: number;
    indir_fuel_percentage_of_lifetime: number;
    indir_fuel_number_of_sold: number;
    indir_fuel_consumption: number;
    indir_fuel_consumption_unit: string;
}

export class IndirectElectricityData{
    id:number;
    typeName: string;
    indir_elec_lifetime: number;
    indir_elec_percentage_of_lifetime: number;
    indir_elec_number_of_sold: number;
    indir_elec_consumption: number;
    indir_elec_consumption_unit: string;;
}

export class IndirectRefrigerantdata {
    id:number;
    typeName: string;
    ref_type:string;
    indir_ref_lifetime: number;
    indir_ref_percentage_of_lifetime: number;
    indir_ref_number_of_sold: number;
    indir_ref_leakage: number;
    indir_ref_leakage_unit: string;;
}

export class IndirectGHGData {
    id:number;
    typeName: string;
    ghg_type: string;
    indir_ghg_lifetime: number;
    indir_ghg_percentage_of_lifetime: number;
    indir_ghg_number_of_sold: number;
    indir_ghg_emit: number;
    indir_ghg_emit_unit: string;;
}

export class IntermediateData {
    id:number;
    typeName: string;
    product_type: string;
    intermediate_sold: number;
    intermediate_lifetime: number;
    intermediate_ef: number;
    intermediate_ef_unit: string;;
}

