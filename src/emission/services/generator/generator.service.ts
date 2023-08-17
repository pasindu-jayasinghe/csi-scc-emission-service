import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPrice } from 'src/emission/emission-factors/fuel-price.entity';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, ParamterUnit, volumes } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { unit } from 'src/emission/enum/unit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { generatorDto } from './generator.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class GeneratorService implements Iso14064Service, GHGProtocolService  {

    public fuelSpecific

    constructor(
        private service: CommonEmissionFactorService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private conversionService: UnitConversionService
    ) { }
   
    async calculationGHGProtocol(data: any) {
        let vol_units = volumes

        let tedge: number;
        let edg: number;
        console.log("data----",data)
        let vol_unit = ParamterUnit.generator_vol
        let currency_units = currencies
        let currency_unit = ParamterUnit.generator_currency

        let value = data.fc
        let fuel = await this.fuelFactorService.getFuelFactors2(sourceName.generator, data.baseData.sourceType, data.baseData.industry,
            data.baseData.tier, data.year, data.baseData.countryCode, [data.fuelType])
            this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuelType])

        let fuelPrice = await this.fuelPriceService.getFuelPrice(data.year,data.month, data.unit,data.baseData.countryCode, [data.fuelType])



        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);

        let unit = data.unit
        let fc: number;
        if (vol_units.includes(unit)) {
            if (vol_unit !== unit) {
                value = this.conversionService.convertUnit(value, unit, vol_unit).value
            }
            fc = value / 1000;
        }
        else if (currency_units.includes(unit)) {
            if (currency_unit !== unit) {
                value = this.conversionService.convertUnit(value, unit, currency_unit).value
            }
          
            fc = value / (fuelPrice.price *1000)            
        }
        else {
            fc = value;
        }

        
        tedge = fc * this.fuelSpecific.density * this.fuelSpecific.ncv;

     
        edg = ((fuel.co2_default * gwp_co2) / 1000 * tedge) + ((fuel.ch4_default * gwp_ch4) / 1000 * tedge) + ((fuel.n20_default * gwp_n2o) / 1000 * tedge)
        console.log({value:value,
        fc:fc,
       ch4: fuel.ch4_default,
       co2:fuel.co2_default,
       n20:fuel.n20_default
    
    
    })
    

        let response = new emissionCalResDto();
        response.e_sc = edg;
        response.e_sc_ch4 = (((fuel.ch4_default * gwp_ch4) / 1000) * tedge);
        response.e_sc_co2 = ((fuel.co2_default * gwp_co2) / 1000 * tedge)
        response.e_sc_n2o = ((fuel.n20_default * gwp_n2o) / 1000 * tedge);

        return response;
    }

    async calculationIso14064(data: generatorDto) {


        let tedge: number;
        let edg: number;
        let fc: number;

        let vol_units = volumes
        let vol_unit = ParamterUnit.generator_vol
        let currency_units = currencies
        let currency_unit = ParamterUnit.generator_currency

        let value = data.fc


        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);


        let fuel = await this.fuelFactorService.getFuelFactors2(sourceName.generator, data.baseData.sourceType, data.baseData.industry,
            data.baseData.tier, data.year, data.baseData.countryCode, [data.fuelType])
        this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuelType])
        let fuelPrice = await this.fuelPriceService.getFuelPrice(data.year,data.month, data.unit,data.baseData.countryCode, [data.fuelType])
    
        //let fuelSpecificyear:number ,month:number, curruncy:string,countryCode:string, codes:fuelType[]):Promise<any>{
        console.log("fuel---", fuel)

        let unit = data.unit


        if (vol_units.includes(unit)) {
            if (vol_unit !== unit) {
                value = this.conversionService.convertUnit(value, unit, vol_unit).value
            }
            fc = value / 1000;
        }
        else if (currency_units.includes(unit)) {
            if (currency_unit !== unit) {
                value = this.conversionService.convertUnit(value, unit, currency_unit).value
            }
          
            fc = value / (fuelPrice.price *1000)

            console.log("sssss--",{
                value: value,
                fuelp: fuelPrice.price,
                fc:fc
            })
        }
        else {
            fc = value;
        }

        tedge = fc * this.fuelSpecific.density * this.fuelSpecific.ncv;

     
        edg = ((fuel.co2_default * gwp_co2) / 1000 * tedge) + ((fuel.ch4_default * gwp_ch4) / 1000 * tedge) + ((fuel.n20_default * gwp_n2o) / 1000 * tedge)
        console.log("resss---",{
            den:this.fuelSpecific.density ,
            ncv:this.fuelSpecific.ncv,
            co2:fuel.co2_default,
            ch4:fuel.ch4_default,
            n20:fuel.n20_default,
            gwp_co2:gwp_co2,
            gwp_ch4:gwp_ch4,
            gwp_n2o:gwp_n2o,
            tedge:tedge,
            edg:edg,
            })
    
        let response = new emissionCalResDto();
        response.e_sc = edg;
        response.e_sc_ch4 = (((fuel.ch4_default * gwp_ch4) / 1000) * tedge);
        response.e_sc_co2 = ((fuel.co2_default * gwp_co2) / 1000 * tedge)
        response.e_sc_n2o = ((fuel.n20_default * gwp_n2o) / 1000 * tedge);

        return response;



    }


}
