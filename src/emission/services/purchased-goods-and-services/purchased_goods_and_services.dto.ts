import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { TransportMode } from "src/emission/enum/transport.enum";
import { WasteActivities } from "../waste-disposal/waste-disposal.enum";
import { PurchaseGoodAndService, TypeNames } from "src/emission/enum/purchase-good-and-service.enum";

export class PurchasedGoodsAndServicesDto {
    mode: PurchaseGoodAndService
    data: SupplierData | PurchaseData | MaterialData | MaterialTransportData | WasteData | WasteOtherData | AverageData | SpendData
    year: number
    baseData: BaseDataDto
}

export class SupplierData{
    id:number;
    typeName: TypeNames;
    supplierType: string
    supplierQuantity: number
    supplierQuantity_unit: string
    supplierEF: number
    supplierEF_unit: string
}
export class PurchaseData{
    id:number;
    typeName: TypeNames;
    purchaseType: string
    purchaseEmission: number
    purchaseEmission_unit: string
}

export class MaterialData{
    id:number;
    typeName: TypeNames;
    materialType: string
    materialAmount: number
    materialAmount_unit: string
    materialEF: number
    materialEF_unit: string
}

export class MaterialTransportData{
    id:number;
    typeName: TypeNames;
    materialTransType: string
    distance: number
    distance_unit: string
    materialTransAmount: number
    materialTransAmount_unit: string
    materialTransEF: number
    materialTransEF_unit: string
}

export class WasteData{
    id:number;
    typeName: TypeNames;
    wasteType: string
    wasteAmount: number
    wasteAmount_unit: string
    waste_activity: WasteActivities;
    gas_type: string;
    wasteBasis: string;
    biologicalTreatmentSystem: string;
    wasteCategory: string;
    typeOfWaste: string;
    mswType: string;
    // co2EfType: string;
    treatmentDischargeType: string;
    approach: string;
    climateZone: string;
    efType: string;
    efCategory: string; 
    waste: string;
    disposalMethod: string;
}

export class WasteOtherData{
    id:number;
    typeName: TypeNames;
    otherEmission: number
    otherEmission_unit: string
}
export class AverageData{
    id:number;
    typeName: TypeNames;
    averageType: string
    averageAmount: number
    averageAmount_unit: string
    averageEF: number
    averageEF_unit: string
}

export class SpendData{
    id:number;
    typeName: TypeNames;
    spendType: string
    spendAmount: number
    spendAmount_unit: string
    spendEF: number
    spendEF_unit: string
}