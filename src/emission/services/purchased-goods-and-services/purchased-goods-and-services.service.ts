import { Injectable } from '@nestjs/common';
import { GHGProtocolService } from '../GHGProtocol.service';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { WasteActivities, WasteDisposalMethod } from '../waste-disposal/waste-disposal.enum';
import { BiologicalTreatmentSolidWasteService } from 'src/emission/emission-factors/biologicalTreatmentSolidWaste.service';
import { WasteIncinerationService } from 'src/emission/emission-factors/waste-incineration.service';
import { OpenBurningOfWasteService } from 'src/emission/emission-factors/open-burning-of-waste.service';
import { DomesticWWTreatmentDischargeService } from 'src/emission/emission-factors/domestic-ww-treatment-discharge.service';
import { IndustrialWWTreatmentDischargeService } from 'src/emission/emission-factors/industrial-ww-treatment-discharge.service';
import { SolidWasteDisposalService } from 'src/emission/emission-factors/solid-w-disposal.service';
import { DefraService } from 'src/emission/emission-factors/defra.service';
import { IncinerationService } from 'src/emission/emission-factors/incineration.service';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { PurchaseGoodAndService, TypeNames } from 'src/emission/enum/purchase-good-and-service.enum';
import { AverageData, MaterialData, MaterialTransportData, PurchasedGoodsAndServicesDto, SpendData, SupplierData, WasteData } from './purchased_goods_and_services.dto';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';

@Injectable()
export class PurchasedGoodsAndServicesService implements GHGProtocolService{

    tier: string
    countryCode: string
    year: number
    gwp_co2: number
    gwp_ch4: number
    gwp_n2o: number
    
    constructor(
        private unitConversionService: UnitConversionService,
        private biologicalTreatmentSolidWasteService: BiologicalTreatmentSolidWasteService,
        private wasteIncinerationService: WasteIncinerationService,
        private openBurningOfWasteService: OpenBurningOfWasteService,
        private domesticWWTreatmentDischargeService: DomesticWWTreatmentDischargeService,
        private industrialWWTreatmentDischargeService: IndustrialWWTreatmentDischargeService,
        private solidWasteDisposalService: SolidWasteDisposalService,
        private defraService: DefraService,
        private incinerationService: IncinerationService,
        private netZeroFactorService: NetZeroFactorService,
        private commonEmissionFactorService: CommonEmissionFactorService
    ){}

    async calculationGHGProtocol(data: PurchasedGoodsAndServicesDto) {
        let response = new emissionCalResDto()

        this.year = data.year
        this.countryCode = data.baseData.countryCode
        this.tier = data.baseData.tier

        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.commonEmissionFactorService.getCommonEmissionFactors(this.year, this.countryCode,
          [
            emissionFactors.gwp_co2,
            emissionFactors.gwp_ch4,
            emissionFactors.gwp_n2o,
          ],
        );

        this.gwp_co2 = gwp_co2; this.gwp_ch4 = gwp_ch4; this.gwp_n2o = gwp_n2o

        if (data.mode === PurchaseGoodAndService.supplier_specific_method){
            response = await this.calculationSupplierMethod(data.data)
        } else if (data.mode === PurchaseGoodAndService.hybrid_method){
            response = await this.calculateHybridMethod(data.data)
        } else if (data.mode === PurchaseGoodAndService.average_data_method){
            response = await this.calculationAverageMethod(data.data)
        } else if (data.mode === PurchaseGoodAndService.spend_based_method){
            response = await this.calculationSpendMethod(data.data)
        }
        return response
    }

    async calculationSupplierMethod(data: any) {
        let response = new emissionCalResDto()
        if (data.supplierQuantity_unit !== ParamterUnit.purchase_good_services_supplier_quantity) {
            data.supplierQuantity = this.unitConversionService.convertUnit(data.supplierQuantity, data.supplierQuantity_unit, ParamterUnit.purchase_good_services_supplier_quantity).value
        }
        if (data.supplierEF && data.supplierEF !== 0){
            if (data.supplierEF_unit !== ParamterUnit.purchase_good_services_supplier_ef) {
                data.supplierEF = this.unitConversionService.convertUnit(data.supplierEF, data.supplierEF_unit, ParamterUnit.purchase_good_services_supplier_ef).value
            }
        } else {
            let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['SUPPLIER_SPECIFIC_PRODUCT_' + data.supplierType]])
            data.supplierEF = res['SUPPLIER_SPECIFIC_PRODUCT_' + data.supplierType]
        }
        
        let res = data.supplierQuantity * data.supplierEF
        response.e_sc_co2 = 0
        response.e_sc_ch4 = 0
        response.e_sc_n2o = 0
        response.e_sc = res / 1000 //divide by 1000 to get emission in tCO2
        return response
    }

    async calculateHybridMethod(data: any){
        let response = new emissionCalResDto()

        if (data.typeName === TypeNames.purchase){
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
            response.e_sc = data.purchaseEmission / 1000 //divide by 1000 to get emission in tCO2
        } else if (data.typeName === TypeNames.material){
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
            response.e_sc = await this.calculationHybridMaterial(data)
        } else if (data.typeName === TypeNames.transport){
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
            response.e_sc = await this.calculationHybridTransport(data)
        } else if (data.typeName === TypeNames.waste){
            response = await this.calculationHybridWaste(data)
        } else if (data.typeName === TypeNames.other) {
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
            response.e_sc = data.otherEmission / 1000 //divide by 1000 to get emission in tCO2
        }

        return response

    }

    async calculationHybridMaterial(data: MaterialData){
        if (data.materialAmount_unit !== ParamterUnit.purchase_good_services_hybrid_material_amount){
            data.materialAmount = this.unitConversionService.convertUnit(data.materialAmount, data.materialAmount_unit, ParamterUnit.purchase_good_services_hybrid_material_amount).value
        }
        if (data.materialEF && data.materialEF !== 0){
            if (data.materialEF_unit !== ParamterUnit.purchase_good_services_hybrid_material_amount_ef){
                data.materialEF = this.unitConversionService.convertUnit(data.materialEF, data.materialEF_unit, ParamterUnit.purchase_good_services_hybrid_material_amount_ef).value
            }
        } else {
            let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['CRADLE_TO_GATE_EF_' + data.materialType + '_' + data.materialAmount_unit]])
            data.materialEF = res['CRADLE_TO_GATE_EF_' + data.materialType + '_' + data.materialAmount_unit]
        }

        return (data.materialAmount * data.materialEF) / 1000 //divide by 1000 to get emission in tCO2
    }

    async calculationHybridTransport(data: MaterialTransportData){
        if (data.distance_unit !== ParamterUnit.purchase_good_services_hybrid_trans_distance){
            data.distance = this.unitConversionService.convertUnit(data.distance, data.distance_unit, ParamterUnit.purchase_good_services_hybrid_trans_distance).value
        }
        if (data.materialTransAmount_unit !== ParamterUnit.purchase_good_services_hybrid_trans_mass){
            data.materialTransAmount = this.unitConversionService.convertUnit(data.materialTransAmount, data.materialTransAmount_unit, ParamterUnit.purchase_good_services_hybrid_trans_mass).value
        }
        if (data.materialTransEF && data.materialTransEF !== 0){
            if (data.materialTransEF_unit !== ParamterUnit.purchase_good_services_hybrid_trans_ef){
                data.materialTransEF = this.unitConversionService.convertUnit(data.materialTransEF, data.materialTransEF_unit, ParamterUnit.purchase_good_services_hybrid_trans_ef).value
            }
        } else {
            let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['CRADLE_TO_GATE_EF_VEHICLE_' + data.materialTransType + '_' + data.materialTransAmount_unit]])
            data.materialTransEF = res['CRADLE_TO_GATE_EF_VEHICLE_' + data.materialTransType + '_' + data.materialTransAmount_unit]
        }
        return (data.distance * data.materialTransAmount * data.materialTransEF) / 1000 //divide by 1000 to get emission in tCO2
    }

    async calculationHybridWaste(data: WasteData){
        let response = new emissionCalResDto()
        if (data.wasteAmount_unit !== ParamterUnit.purchase_good_services_hybrid_waste_amount){
            data.wasteAmount = this.unitConversionService.convertUnit(data.wasteAmount, data.wasteAmount_unit, ParamterUnit.purchase_good_services_hybrid_waste_amount).value
        }
        data.wasteAmount = data.wasteAmount / 1000 // as EF available in tCO2e
        let ef = await this.getWasteEmissionFactor(data)
        console.log(ef, data.wasteAmount)
        if (ef?.ef_co2e){
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
            response.e_sc = ef.ef_co2e * data.wasteAmount
        } else {
            if (ef) {
                response.e_sc_co2 = ((ef.ef_co2 * this.gwp_co2) / 1000) * data.wasteAmount
                response.e_sc_ch4 = ((ef.ef_ch4 * this.gwp_ch4) / 1000) * data.wasteAmount
                response.e_sc_n2o = ((ef.ef_n2o * this.gwp_n2o) / 1000) * data.wasteAmount
                response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o
            }
        }
        // response.e_sc_co2 = (ef.ef_co2 )
        return response
    }

    async getWasteEmissionFactor(data: WasteData):Promise<EmissionFactor>{
        switch (data.waste_activity) {
            case WasteActivities.BIOLOGICAL_TREATMENT:
                return await this.getBiologicalTreatmentEF(data.gas_type, data.wasteBasis, data.biologicalTreatmentSystem, data.wasteCategory, data.typeOfWaste)
            case WasteActivities.WASTE_INCINERATION:
                return await this.getWasteIncinerationEF(data.gas_type, data.mswType, data.wasteCategory, data.typeOfWaste);
            case WasteActivities.OPEN_BURNING:
                return await this.getOpenBurningEF(data.gas_type, data.mswType, data.wasteCategory, data.typeOfWaste);
            case WasteActivities.DOMESTIC_WASTEWATER:
                return await this.getDomesticWastewaterEF(data.treatmentDischargeType);
            case WasteActivities.INDUSTRIAL_WASTEWATER:
                return await this.getIndustrialWasteWaterEF(data.treatmentDischargeType);
            case WasteActivities.OTHER:
                return await this.getDefraEF([data.waste], data.disposalMethod);
            case WasteActivities.INCINERATION:
                return await this.getIncinerationEF([data.waste]);
        }
    }

    async getBiologicalTreatmentEF(gasType: string, wasteBasis: string, biologicalTreatmentSystem: string,
        wasteCategory: string, typeOfWaste: string) {
        let ef = await this.biologicalTreatmentSolidWasteService.getBiologicalTreatmentFactors(
            gasType, wasteBasis, biologicalTreatmentSystem, wasteCategory, typeOfWaste, this.tier, this.countryCode
        )

        let obj: EmissionFactor = { ef_co2: 0, ef_ch4: 0, ef_n2o: 0, ef_co2e: 0 }

        if (gasType === 'CO2') {
            obj.ef_co2 = ef[0].dm * ef[0].cf * ef[0].fcf * ef[0].of
            obj.ef_ch4 = 0
            obj.ef_n2o = 0
        } else if (gasType === 'CH4') {
            obj.ef_co2 = 0
            obj.ef_ch4 = +ef[0].ef
            obj.ef_n2o = 0
        } else if (gasType === 'N2O') {
            obj.ef_co2 = 0
            obj.ef_ch4 = 0
            obj.ef_n2o = +ef[0].ef
        }
        obj.ef_co2e = 0

        return obj
    }

    async getWasteIncinerationEF(gasType: string, mswType: string,
        wasteCategory: string, typeOfWaste: string) {
        let ef = await this.wasteIncinerationService.getWasteIncinerationFactors(
            gasType, mswType, wasteCategory, typeOfWaste, this.tier, this.countryCode
        )

        let obj: EmissionFactor = { ef_co2: 0, ef_ch4: 0, ef_n2o: 0, ef_co2e: 0 }

        if (gasType === 'CO2') {
            obj.ef_co2 = ef[0].dm * ef[0].cf * ef[0].fcf * ef[0].of
            obj.ef_ch4 = 0
            obj.ef_n2o = 0
        } else if (gasType === 'CH4') {
            obj.ef_co2 = 0
            obj.ef_ch4 = +ef[0].ef
            obj.ef_n2o = 0
        } else if (gasType === 'N2O') {
            obj.ef_co2 = 0
            obj.ef_ch4 = 0
            obj.ef_n2o = +ef[0].ef
        }
        obj.ef_co2e = 0

        return obj
    }

    async getOpenBurningEF(gasType: string, mswType: string,
        wasteCategory: string, typeOfWaste: string) {
        let ef = await this.openBurningOfWasteService.getOpenBurningFactors(
            gasType, mswType, wasteCategory, typeOfWaste, this.tier, this.countryCode
        )
        // let ef_ch4 = await this.openBurningOfWasteService.getOpenBurningFactors(
        //     'CH4', mswType, wasteCategory, typeOfWaste, this.tier, this.countryCode
        // )
        // let ef_n2o = await this.openBurningOfWasteService.getOpenBurningFactors(
        //     'N2O', mswType, wasteCategory, typeOfWaste, this.tier, this.countryCode
        // )

        let obj: EmissionFactor = { ef_co2: 0, ef_ch4: 0, ef_n2o: 0, ef_co2e: 0 }

        if (gasType === 'CO2'){
            obj.ef_co2 = ef[0].dm * ef[0].cf * ef[0].fcf * ef[0].of
            obj.ef_ch4 = 0
            obj.ef_n2o = 0
        } else if (gasType === 'CH4'){
            obj.ef_co2 = 0
            obj.ef_ch4 = +ef[0].ef
            obj.ef_n2o = 0
        } else if (gasType === 'N2O'){
            obj.ef_co2 = 0
            obj.ef_ch4 = 0
            obj.ef_n2o = +ef[0].ef
        }
        obj.ef_co2e = 0

        return obj
    }

    async getDomesticWastewaterEF(treatmentDischargeType: string) {
        let ef = await this.domesticWWTreatmentDischargeService.getDomesticWasteWaterFactors(
            treatmentDischargeType, this.tier
        )

        return {
            ef_co2: 0,
            ef_ch4: 0,
            ef_n2o: 0,
            ef_co2e: ef[0].MCF
        }
    }

    async getIndustrialWasteWaterEF(treatmentDischargeType: string) {
        let ef = await this.industrialWWTreatmentDischargeService.getIndustrialWasteWaterFactors(
            treatmentDischargeType, this.tier
        )

        return {
            ef_co2: 0,
            ef_ch4: 0,
            ef_n2o: 0,
            ef_co2e: ef[0].MCF
        }
    }

    getSolidWasteDisposalEF() {
        //not used for this EF (suggested by CB, WS)
        return {
            ef_co2: 0,
            ef_ch4: 0,
            ef_n2o: 0,
            ef_co2e: 0
        }
    }

    async getDefraEF(codes:any[], disposalMethod: string) {
        let ef = await this.defraService.getDefraFac(this.year, this.tier, codes)

        if (ef !== -1) {
            switch (disposalMethod) {
    
                case WasteDisposalMethod.RE_USE: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.reUse
                    }
                }
    
                case WasteDisposalMethod.OPEN_LOOP: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.openLoop
                    }
                }
    
                case WasteDisposalMethod.CLOSED_LOOP: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.closedLoop
                    }
                }
    
                case WasteDisposalMethod.COMBUSION: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.combution
                    }
                }
    
                case WasteDisposalMethod.COMPOSTING: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.composting
                    }
                }
    
                case WasteDisposalMethod.LANDFILL: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.landFill
                    }
                }
    
                case WasteDisposalMethod.ANAEROBIC_DIGESTION: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.AnaeriobicDigestions
                    }
                }
    
                case WasteDisposalMethod.PIGGERY_FEEDING: {
    
                    // if (data.month === 12) {
                    //     months = 1;
                    // } else {
                    //     months = 12;
                    // }
    
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.PiggeryFeeding
                    }
                }
    
                case WasteDisposalMethod.INCINERATION: {
                    // carbonFraction = incinerationFactor.carbonFraction;
                    // dryMatter = incinerationFactor.dryMatter;
                    // fossilCarbonFraction = incinerationFactor.fossilCarbonFraction;
                    // oxidationFactor = incinerationFactor.oxidationFactor;
                    // ef_ch4 = incinerationFactor.ef_ch4;
                    // ef_n2o = incinerationFactor.ef_n2o;
    
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.Incineration
                    }
                }
    
                default: {
                    return {
                        ef_co2: 0,
                        ef_ch4: 0,
                        ef_n2o: 0,
                        ef_co2e: ef.MCF
                    }
                }
    
            }
        }

    }

    async getIncinerationEF(codes: any[]) {
        let ef = await this.incinerationService.getIncinerationFac(this.year, codes)

        return {
            ef_co2: ef.dryMatter * ef.carbonFraction * ef.fossilCarbonFraction * ef.oxidationFactor,
            ef_ch4: ef.ef_ch4,
            ef_n2o: ef.ef_n2o,
            ef_co2e: 0
        }
    }

    async calculationAverageMethod(data: any){
        let response = new emissionCalResDto()
        if (data.averageAmount_unit === ParamterUnit.purchase_good_services_average_method_mass){
            if (data.averageEF && data.averageEF !== 0){
                if (data.averageEF_unit !== ParamterUnit.purchase_good_services_average_method_mass_ef){
                    data.averageEF = this.unitConversionService.convertUnit(data.averageEF, data.averageEF_unit, ParamterUnit.purchase_good_services_average_method_mass_ef).value
                }
            } else {
                let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['AVERAGE_METHOD_EF_PER_UNIT_OF_MASS_' + data.averageType]])
                data.averageEF = res['AVERAGE_METHOD_EF_PER_UNIT_OF_MASS_' + data.averageType]
            }
        } else {
            if (data.averageEF && data.averageEF !== 0){
                if (data.averageEF_unit !== ParamterUnit.purchase_good_services_average_method_reference_ef){
                    data.averageEF = this.unitConversionService.convertUnit(data.averageEF, data.averageEF_unit, ParamterUnit.purchase_good_services_average_method_reference_ef).value
                }
            } else {
                let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['AVERAGE_METHOD_EF_PER_REFERENCE_UNIT_' + data.averageType]])
                data.averageEF = res['AVERAGE_METHOD_EF_PER_REFERENCE_UNIT_' + data.averageType]
            }
        }

        response.e_sc_co2 = 0
        response.e_sc_ch4 = 0
        response.e_sc_n2o = 0
        response.e_sc = (data.averageAmount * data.averageEF) / 1000 //divide by 1000 to get emission in tCO2

        return response
    }

    async calculationSpendMethod(data: any) {
        let response = new emissionCalResDto()
        if (data.spendEF === 0 || data.spendEF === null) {
            let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Purchased_Goods_and_Services, [netZeroFactors['SPEND_BASED_METHOD_EF_' + data.spendType]])
            data.spendEF = res['SPEND_BASED_METHOD_EF_' + data.spendType]
        }

        response.e_sc_co2 = 0
        response.e_sc_ch4 = 0
        response.e_sc_n2o = 0
        response.e_sc = (data.spendAmount * data.spendEF) / 1000 //divide by 1000 to get emission in tCO2

        return response
    }
}

export interface EmissionFactor{
    ef_co2: number
    ef_ch4: number
    ef_n2o: number
    ef_co2e: number
}
