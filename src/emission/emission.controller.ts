import { Body, Controller, Get, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { emissionCalReqDto } from './dto/emission-req.dto';
import { emissionCalResDto } from './dto/emission-res.dto';
import { EmissionService } from './emission.service';
import { sourceName } from './enum/sourcename.enum';
import { ElectricityService } from './services/electricity/electricity.service';
import { FireExtinguisherService } from './services/fire-extinguisher/fire-extinguisher.service';
import { GeneratorService } from './services/generator/generator.service';
import { CookingService } from './services/lp-gas/cooking.service';

//import { RefrigerantService } from './services/refrigerant/refrigerant.service';
import { RefrigerantService } from './services/refrigerant/refrigerant.service';
import { GasBiomassService } from './services/gas-biomass/gas-biomass.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeldingEsService } from './services/welding-es/welding-es.service';
import { ForkliftsService } from './services/forklifts/forklifts.service';
import { BoilerService } from './services/boiler/boiler.service';
import { WasteWaterTreatmentService } from './services/waste-water-treatment/waste-water-treatment.service';
import { MunicipalWaterService } from './services/municipal-water/municipal-water.service';
import { FreightAirService } from './services/freight-air/freight-air.service';
import { FreightOffroadService } from './services/freight-offroad/freight-offroad.service';
import { FreightRailService } from './services/freight-rail/freight-rail.service';
import { FreightRoadService } from './services/freight-road/freight-road.service';
import { FreightWaterService } from './services/freight-water/freight-water.service';
import { PassengerAirService } from './services/passenger-air/passenger-air.service';
import { PassengerOffroadService } from './services/passenger-offroad/passenger-offroad.service';
import { PassengerRailService } from './services/passenger-rail/passenger-rail.service';
import { PassengerRoadService } from './services/passenger-road/passenger-road.service';
import { PassengerWaterService } from './services/passenger-water/passenger-water.service';
import { WasteDisposalService } from './services/waste-disposal/waste-disposal.service';
import { CookingGasService } from './services/cooking-gas/cooking-gas.service';
import { OffroadMachineryService } from './services/offroad-machinery/offroad-machinery.service';
import { TNDLossService } from './services/t-n-d-loss/t-n-d-loss.service';
import { Iso14064Service } from './services/iso14064.service';
import { GHGProtocolService } from './services/GHGProtocol.service';

import { InvestmentsService } from './services/investments/investments.service';
import { fuelEnergyRelatedActivitiesService } from './services/fuel_energy_related_activities/fuel_energy_related_activities.service';
import { NetZeroBusinessTravelService } from './services/net-zero-business-travel/net-zero-business-travel.service';
import { eoltOfSoldProductsService } from './services/eolt_of_sold_products/eolt_of_sold_products.service';
import { ProcessingOfSoldProductsService } from './services/processingOf-sold-products/processingOf-sold-products.service';
import { NetZeroEmployeeCommutingService } from './services/net-zero-employee-commuting/net-zero-employee-commuting.service';
import { UpstreamTransportationService } from './services/upstream-transportation/upstream-transportation.service';
import { WasteGeneratedInOperationsService } from './services/waste-generated-in-operations/waste-generated-in-operations.service';
import { upstreamLeasedAssetsService } from './services/upstream_leased_assets/upstream_leased_assets.service';
import { DownstreamLeasedAssetsService } from './services/downstream_leased_assets/downstream_leased_assets.service';
import { FranchisesService } from './services/franchises/franchises.service';
import { PurchasedGoodsAndServicesService } from './services/purchased-goods-and-services/purchased-goods-and-services.service';
import { DownstreamTransportationService } from './services/downstream-transportation/downstream-transportation.service';
import { NetZeroUseOfSoldProductsService } from './services/net-zero-use-of-sold-products/net-zero-use-of-sold-products.service';
import { CapitalGoodsService } from './services/capital-goods/capital-goods.service';

@Controller('emission')
export class EmissionController {


    constructor(public service: EmissionService,
        private elecService: ElectricityService,
        private generatorService: GeneratorService,
        private cookingService: CookingService,
        private fireExtinguisherService: FireExtinguisherService,
        private refService: RefrigerantService,
        private gasBiomassService: GasBiomassService,
        private weldingEsService: WeldingEsService,
        private forkliftsService: ForkliftsService,
        private boilerService: BoilerService,
        private wasteWaterTreatmentService: WasteWaterTreatmentService,
        private municipalWaterService: MunicipalWaterService,
        private freightAirService: FreightAirService,
        private freightOffroadService: FreightOffroadService,
        private freightRailService: FreightRailService,
        private freightRoadService: FreightRoadService,
        private freightWaterService: FreightWaterService,
        private passengerAirService: PassengerAirService,
        private passengerOffroadService: PassengerOffroadService,
        private passengerRailService: PassengerRailService,
        private passengerRoadService: PassengerRoadService,
        private passengerWaterService: PassengerWaterService,
        private wasteDisposalService: WasteDisposalService,
        private cookingGasService: CookingGasService,
        private offroadMachinery: OffroadMachineryService,
        private tNDLossService: TNDLossService,
        private netZeroBusinessTravelService: NetZeroBusinessTravelService,
        private netZeroEmployeeCommutingService: NetZeroEmployeeCommutingService,
        private wasteGeneratedInOperationsService: WasteGeneratedInOperationsService,
        private investmentService: InvestmentsService,
        private processingOfSoldProductsService: ProcessingOfSoldProductsService,
        private fuelAndEnergyActivities: fuelEnergyRelatedActivitiesService,
        private eoltOfSoldProductsService: eoltOfSoldProductsService,
        private upstreamTransportService: UpstreamTransportationService,
        private downstreamTransportationService: DownstreamTransportationService,
        private upstreamLeasedAssetsService: upstreamLeasedAssetsService,
        private purchasedGoodsAndServicesService: PurchasedGoodsAndServicesService,
        private downstreamLeasedAssetsService:DownstreamLeasedAssetsService,
        private franchisesService: FranchisesService,
        private netZeroUseOfSoldProductsService: NetZeroUseOfSoldProductsService,
        private capitalGoodsService: CapitalGoodsService,


    ) { }

    // @UseGuards(JwtAuthGuard)
    // @Get('test')
    // public test(){
    //     return "ascs";
    // }

    getService(esName: sourceName) {
        switch (esName) {
            case sourceName.electricity: {
                return this.elecService;
            }
            case sourceName.generator: {
                return this.generatorService;
            }
            case sourceName.cooking: {
                return this.cookingService;
            }
            case sourceName.fire_extinguisher: {
                return this.fireExtinguisherService;
            }
            case sourceName.refrigerant: {
                return this.refService;
            }
            case sourceName.gas_biomass: {
                return this.gasBiomassService;
            }
            case sourceName.welding_es: {
                return this.weldingEsService;
            }
            case sourceName.forklifts: {
                return this.forkliftsService;
            }
            case sourceName.boilers: {
                return this.boilerService;
            }
            case sourceName.waste_water_treatment: {
                return this.wasteWaterTreatmentService;
            }
            case sourceName.municipal_water: {
                return this.municipalWaterService;
            }
            case sourceName.waste_disposal: {
                return this.wasteDisposalService;
            }
            case sourceName.freight_air: {
                return this.freightAirService;
            }
            case sourceName.freight_offroad: {
                return this.freightOffroadService;
            }
            case sourceName.freight_rail: {
                return this.freightRailService;
            }
            case sourceName.freight_road: {
                return this.freightRoadService;
            }
            case sourceName.freight_water: {
                return this.freightWaterService;
            }
            case sourceName.passenger_offroad: {
                return this.passengerOffroadService;
            }
            case sourceName.passenger_rail: {
                return this.passengerRailService;
            }
            case sourceName.passenger_road: {
                return this.passengerRoadService;
            }
            case sourceName.passenger_water: {
                return this.passengerWaterService;
            }
            case sourceName.cooking_gas: {
                return this.cookingGasService;
            }
            case sourceName.offroad_machinery: {
                return this.offroadMachinery;
            }
            case sourceName.t_n_d_loss: {
                return this.tNDLossService;
            }
            case sourceName.business_travel: {
                return this.passengerRoadService;
            }
            case sourceName.Net_Zero_Business_Travel: {
                return this.netZeroBusinessTravelService;
            }
            case sourceName.Net_Zero_Employee_Commuting: {
                return this.netZeroEmployeeCommutingService;
            }
            case sourceName.Waste_Generated_in_Operations: {
                return this.wasteGeneratedInOperationsService;
            }
            case sourceName.Investments: {
                return this.investmentService;
            }
            case sourceName.Processing_of_Sold_Products: {
                return this.processingOfSoldProductsService;
            }
            case sourceName.Fuel_Energy_Related_Activities: {
                return this.fuelAndEnergyActivities;
            }

            case sourceName.End_of_Life_Treatment_of_Sold_Products: {
                return this.eoltOfSoldProductsService;
            }
            case sourceName.Upstream_Transportation_and_Distribution: {
                return this.upstreamTransportService;
            }
            case sourceName.Downstream_Transportation_and_Distribution: {
                return this.downstreamTransportationService;
            }
            case sourceName.Upstream_Leased_Assets: {
                return this.upstreamLeasedAssetsService;
            }
            case sourceName.Franchises: {
                return this.franchisesService;
            }
            case sourceName.Purchased_Goods_and_Services: {
                return this.purchasedGoodsAndServicesService;
            }
            case sourceName.Downstream_Leased_Assets: {
                return this.downstreamLeasedAssetsService;
            }
            case sourceName.Use_of_Sold_Products: {
                return this.netZeroUseOfSoldProductsService;
            }
            case sourceName.Capital_Goods: {
                return this.capitalGoodsService;
            }
            
            default: {
                throw new InternalServerErrorException("Service not found for " + esName);
            }
        }
    }

    @Post('/cal')
    public async emissionCal(@Body() req: emissionCalReqDto): Promise<emissionCalResDto> {

        var response = new emissionCalResDto();
        switch (req.methodology.trim()) {
            case 'GHG_PROTOCAL': {
                let service: GHGProtocolService = this.getService(req.sourceName) as GHGProtocolService;
                response = await service.calculationGHGProtocol(req.data);
                break;
            }
            case 'ISO14064': {
                let service: Iso14064Service = this.getService(req.sourceName) as Iso14064Service;
                response = await service.calculationIso14064(req.data);
                break;
            }
            default: {

                let service: Iso14064Service = this.getService(req.sourceName) as Iso14064Service;
                response = await service.calculationIso14064(req.data);
                break;
            }
        }
        return response


    }


}
