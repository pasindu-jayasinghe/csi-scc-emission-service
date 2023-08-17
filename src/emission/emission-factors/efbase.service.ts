import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { efType } from "../enum/ef-type.enum";
import { ExcellUploadable } from "../services/excell-uploadale";
import { CommonEmissionFactorService } from "./common-emission-factor.service";

import * as XLSX from 'xlsx';
import { efCodeNameDto } from "./efcodename.dto";
import { FuelFactorService } from "./fuel-factor.service";
import { FuelPrice } from "./fuel-price.entity";
import { FuelPriceService } from "./fuel-price.service";
import { FuelSpecificService } from "./fuel-specific.service";
import { FreightWaterFacService } from "./freight-w-factor.service";
import { FreightRailService } from "../services/freight-rail/freight-rail.service";
import { MunicipalWaterTariffService } from "./municipalWaterTariff.service";
import { DefraService } from "./defra.service";
import { FreightRailFactorsService } from "./rail/freight-rail-factors/freight-rail-factors.service";


@Injectable()
export class EmissionFacBaseService {


    constructor(
        private commonEmissionFactorService: CommonEmissionFactorService,
        private fuelFactorService: FuelFactorService,
        private fuelPriceService: FuelPriceService,
        private fuelSpecificService: FuelSpecificService,
        private freightWaterFacService: FreightWaterFacService,
        private freightRailFacService: FreightRailFactorsService,
        private municipalWaterTariffService: MunicipalWaterTariffService,
        private defraService: DefraService,


    ) { }


    async getVariableMapping(efType: efType): Promise<efCodeNameDto> {
        let service = this.getService(efType);
        let efdto = new efCodeNameDto();
        if (service) {

            let s = service.downlodExcellBulkUploadVariableMapping()
            efdto.arr = s;
            return efdto;
        } else {
            return efdto;
        }
    }



    getService(code: string): ExcellUploadable {
        switch (code) {
            case efType.Common:
                return this.commonEmissionFactorService;
                break;
            case efType.FuelFac:
                return this.fuelFactorService;
                break;

            case efType.FuelPrice:
                return this.fuelPriceService;
                break;
            case efType.FuelSpecific:
                return this.fuelSpecificService;
                break;
            case efType.FreightWater:
                return this.freightWaterFacService;
                break;
            case efType.FreightRail:
                return this.freightRailFacService;
                break;
            case efType.MunicipalWaterTariff:
                return this.municipalWaterTariffService;
                break;
            case efType.Defra:
                return this.defraService;
                break;

        }
    }


    async uploadBulk(efType: efType, buffer: Buffer) {
        const workbook = XLSX.read(buffer);

        let data_sheet = workbook.Sheets['in'];

        try {
            if (data_sheet) {
                let data = XLSX.utils.sheet_to_json(data_sheet);
                   
                if (efType) {
                    let year = 2022;

                    let service = this.getService(efType);
                    if (service) {
                        data.forEach(d => {
                            service.excellBulkUpload(d, [], year);
                        })

                        return {
                            status: true,
                            message: 'Uploaded'
                        }
                    } else {
                        return {
                            status: false,
                            message: 'Service is null'
                        }
                    }
                }
            } else {
                console.log("no data_sheet");
                throw new InternalServerErrorException("no data_sheet")
            }
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException(err)
        }

    }



}

