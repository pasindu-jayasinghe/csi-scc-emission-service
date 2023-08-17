import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonEmissionFactor } from './emission-factors/common-emission-factor.entity';
import { CommonEmissionFactorService } from './emission-factors/common-emission-factor.service';
import { FuelFactor } from './emission-factors/fuel-factor.entity';
import { FuelFactorService } from './emission-factors/fuel-factor.service';
import { EmissionController } from './emission.controller';
import { EmissionService } from './emission.service';
import { ElectricityService } from './services/electricity/electricity.service';
import { GeneratorService } from './services/generator/generator.service';
import { CookingService } from './services/lp-gas/cooking.service';
import { FireExtinguisherService } from './services/fire-extinguisher/fire-extinguisher.service';
import { RefrigerantService } from './services/refrigerant/refrigerant.service';
import { GasBiomassService } from './services/gas-biomass/gas-biomass.service';
import { FuelFactorController } from './emission-factors/fuel-factor.controller';
import { Fuel } from './emission-factors/fuel.entity';
import { FuelService } from './emission-factors/fuel.service';
import { FuelController } from './emission-factors/fuel.controller';
import { FuelPrice } from './emission-factors/fuel-price.entity';
import { FuelPriceController } from './emission-factors/fuel-price.controller';
import { FuelPriceService } from './emission-factors/fuel-price.service';
import { FuelSpecific } from './emission-factors/fuel-specfic.entity';
import { FuelSepecificController } from './emission-factors/fuel-specific.controller';
import { FuelSpecificService } from './emission-factors/fuel-specific.service';
import { WeldingEsService } from './services/welding-es/welding-es.service';
import { ForkliftsService } from './services/forklifts/forklifts.service';
import { BoilerService } from './services/boiler/boiler.service';
import { WasteWaterTreatmentService } from './services/waste-water-treatment/waste-water-treatment.service';
import { MunicipalWaterService } from './services/municipal-water/municipal-water.service';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { MasterDataService } from 'src/shared/master-data.service';
import { WasteDisposalService } from './services/waste-disposal/waste-disposal.service';
import { CookingGasService } from './services/cooking-gas/cooking-gas.service';

import { FreightRailService } from './services/freight-rail/freight-rail.service';
import { FreightRoadService } from './services/freight-road/freight-road.service';
import { FreightWaterService } from './services/freight-water/freight-water.service';
import { FreightAirService } from './services/freight-air/freight-air.service';
import { FreightOffroadService } from './services/freight-offroad/freight-offroad.service';
import { PassengerAirService } from './services/passenger-air/passenger-air.service';
import { PassengerOffroadService } from './services/passenger-offroad/passenger-offroad.service';
import { PassengerRailService } from './services/passenger-rail/passenger-rail.service';
import { PassengerWaterService } from './services/passenger-water/passenger-water.service';
import { PassengerRoadService } from './services/passenger-road/passenger-road.service';
import { OffroadMachineryService } from './services/offroad-machinery/offroad-machinery.service';
import { BiologicalTreatmentSolidWaste } from './emission-factors/biologicalTreatmentSolidWaste.entity';
import { BiologicalTreatmentSolidWasteService } from './emission-factors/biologicalTreatmentSolidWaste.service';
import { BiologicalTreatmentSolidWasteController } from './emission-factors/biologicalTreatmentSolidWaste.controller';
import { WasteIncinerationService } from './emission-factors/waste-incineration.service';
import { WasteIncinerationController } from './emission-factors/waste-incineration.controller';
import { WasteIncineration } from './emission-factors/waste-incineration.entity';
import { OpenBurningOfWaste } from './emission-factors/open-burning-of-waste.entity';
import { OpenBurningOfWasteService } from './emission-factors/open-burning-of-waste.service';
import { OpenBurningOfWasteController } from './emission-factors/open-burning-of-waste.controller';
import { IndustrialWWTreatmentDischarge } from './emission-factors/industrial-ww-treatment-discharge.entity';
import { IndustrialWWTreatmentDischargeController } from './emission-factors/industrial-ww-treatment-discharge.controller';
import { IndustrialWWTreatmentDischargeService } from './emission-factors/industrial-ww-treatment-discharge.service';
import { Defra } from './emission-factors/defra.entity';
import { DefraController } from './emission-factors/defra.controller';
import { DefraService } from './emission-factors/defra.service';
import { DomesticWWTreatmentDischarge } from './emission-factors/domestic-ww-treatment-discharge.entity';
import { DomesticWWTreatmentDischargeController } from './emission-factors/domestic-ww-treatment-discharge.controller';
import { DomesticWWTreatmentDischargeService } from './emission-factors/domestic-ww-treatment-discharge.service';
import { SolidWasteDisposalService } from './emission-factors/solid-w-disposal.service';
import { SolidWasteDisposal } from './emission-factors/solid-w-disposal.entity';
import { SolidWasteDisposalController } from './emission-factors/solid-w-disposal.controller';
import { Transport } from './emission-factors/transport.entity';
import { TransportController } from './emission-factors/transport.controller';
import { TransportService } from './emission-factors/transport.service';
import { FreightWaterFac } from './emission-factors/freight-w-factor.entity';
import { FreightWaterFacService } from './emission-factors/freight-w-factor.service';
import { FreightWaterFacController } from './emission-factors/freight-w-factor.controller';
import { CommonEmissionFactorController } from './emission-factors/common-emission-factor.controller';
import { LubricantUse } from './emission-factors/IPPU/non-energy/lubricant-use/lubricant-use.entity';
import { ParaffinWaxUse } from './emission-factors/IPPU/non-energy/paraffin-wax-use/paraffin-wax-use.entity';
import { LubricantUseController } from './emission-factors/IPPU/non-energy/lubricant-use/lubricant-use.controller';
import { ParaffinWaxUseController } from './emission-factors/IPPU/non-energy/paraffin-wax-use/paraffin-wax-use.controller';
import { LubricantUseService } from './emission-factors/IPPU/non-energy/lubricant-use/lubricant-use.service';
import { ParaffinWaxUseService } from './emission-factors/IPPU/non-energy/paraffin-wax-use/paraffin-wax-use.service';
import { IntergratedCircuit } from './emission-factors/IPPU/electronics-industry/intergrated-circuit/intergrated-circuit.entity';
import { TFTFlatPanelDisplay } from './emission-factors/IPPU/electronics-industry/tft-flat-panel-display/tft-flat-panel-display.entity';
import { Photovoltaics } from './emission-factors/IPPU/electronics-industry/photovoltaics/photovoltaics.entity';
import { IntergratedCircuitController } from './emission-factors/IPPU/electronics-industry/intergrated-circuit/intergrated-circuit.controller';
import { TFTFlatPanelDisplayController } from './emission-factors/IPPU/electronics-industry/tft-flat-panel-display/tft-flat-panel-display.controller';
import { PhotovoltaicsController } from './emission-factors/IPPU/electronics-industry/photovoltaics/photovoltaics.controller';
import { IntergratedCircuitService } from './emission-factors/IPPU/electronics-industry/intergrated-circuit/intergrated-circuit.service';
import { TFTFlatPanelDisplayService } from './emission-factors/IPPU/electronics-industry/tft-flat-panel-display/tft-flat-panel-display.service';
import { PhotovoltaicsService } from './emission-factors/IPPU/electronics-industry/photovoltaics/photovoltaics.service';
import { HeatTransferFluid } from './emission-factors/IPPU/electronics-industry/heat-transfer-fluid/heat-transfer-fluid.entity';
import { HeatTransferFluidController } from './emission-factors/IPPU/electronics-industry/heat-transfer-fluid/heat-transfer-fluid.controller';
import { HeatTransferFluidService } from './emission-factors/IPPU/electronics-industry/heat-transfer-fluid/heat-transfer-fluid.service';
import { Accelerators } from './emission-factors/IPPU/other-product-manufacture-use/accelerators/accelerators.entity';
import { DisposalElectricalEquipment } from './emission-factors/IPPU/other-product-manufacture-use/disposal-of-electrical-equipment/disposal-of-electrical-equipment.entity';
import { ManufactureElectricalEquipment } from './emission-factors/IPPU/other-product-manufacture-use/manufacture-electrical-equipment/manufacture-electrical-equipment.entity';
import { MedicalApplications } from './emission-factors/IPPU/other-product-manufacture-use/medical-applications/medical-applications.entity';
import { MilitaryApplications } from './emission-factors/IPPU/other-product-manufacture-use/military-applications/military-applications.entity';
import { AcceleratorsController } from './emission-factors/IPPU/other-product-manufacture-use/accelerators/accelerators.controller';
import { DisposalElectricalEquipmentController } from './emission-factors/IPPU/other-product-manufacture-use/disposal-of-electrical-equipment/disposal-of-electrical-equipment.controller';
import { ManufactureElectricalEquipmentController } from './emission-factors/IPPU/other-product-manufacture-use/manufacture-electrical-equipment/manufacture-electrical-equipment.controller';
import { MedicalApplicationsController } from './emission-factors/IPPU/other-product-manufacture-use/medical-applications/medical-applications.controller';
import { MilitaryApplicationsController } from './emission-factors/IPPU/other-product-manufacture-use/military-applications/military-applications.controller';
import { AcceleratorsService } from './emission-factors/IPPU/other-product-manufacture-use/accelerators/accelerators.service';
import { DisposalElectricalEquipmentService } from './emission-factors/IPPU/other-product-manufacture-use/disposal-of-electrical-equipment/disposal-of-electrical-equipment.service';
import { ManufactureElectricalEquipmentService } from './emission-factors/IPPU/other-product-manufacture-use/manufacture-electrical-equipment/manufacture-electrical-equipment.service';
import { MedicalApplicationsService } from './emission-factors/IPPU/other-product-manufacture-use/medical-applications/medical-applications.service';
import { MilitaryApplicationsService } from './emission-factors/IPPU/other-product-manufacture-use/military-applications/military-applications.service';
import { Incineration } from './emission-factors/incineration.entity';
import { IncinerationController } from './emission-factors/incineration.controller';
import { IncinerationService } from './emission-factors/incineration.service';
import { FreightRailFactorsService } from './emission-factors/rail/freight-rail-factors/freight-rail-factors.service';
import { FreightRailFactorsController } from './emission-factors/rail/freight-rail-factors/freight-rail-factors.controller';
import { FreightRailFactors } from './emission-factors/rail/freight-rail-factors/freight-rail-factors.entity';
import { MunicipalWaterTariff } from './emission-factors/municipalWaterTariff.entity';
import { MunicipalWaterTariffController } from './emission-factors/municipalWaterTariff.controller';
import { MunicipalWaterTariffService } from './emission-factors/municipalWaterTariff.service';
import { EmissionFacBaseController } from './emission-factors/efbase.controller';
import { EmissionFacBaseService } from './emission-factors/efbase.service';
import { TNDLossService } from './services/t-n-d-loss/t-n-d-loss.service';
import { PurchasedGoodsAndServicesService } from './services/purchased-goods-and-services/purchased-goods-and-services.service';
 
import { InvestmentsService } from './services/investments/investments.service';
import { NetZeroFactor } from './emission-factors/net-zero/netzero-factors.entity';
import { NetZeroFactorController } from './emission-factors/net-zero/netzero-factors.controller';
import { NetZeroFactorService } from './emission-factors/net-zero/netzero-factors.service';
import { fuelEnergyRelatedActivitiesDto } from './services/fuel_energy_related_activities/fuel_energy_related_activities.dto';
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
import { DownstreamTransportationService } from './services/downstream-transportation/downstream-transportation.service';
import { NetZeroUseOfSoldProductsService } from './services/net-zero-use-of-sold-products/net-zero-use-of-sold-products.service';
import { CapitalGoodsService } from './services/capital-goods/capital-goods.service';


@Module({

  imports: [TypeOrmModule.forFeature([
    CommonEmissionFactor,
    FuelFactor,
    Fuel,
    FuelPrice,
    FuelSpecific,
    BiologicalTreatmentSolidWaste,
    WasteIncineration,
    OpenBurningOfWaste,
    IndustrialWWTreatmentDischarge,
    Defra, DomesticWWTreatmentDischarge,
    SolidWasteDisposal,
    Transport,
    FreightWaterFac,
    LubricantUse,
    ParaffinWaxUse,
    IntergratedCircuit,
    TFTFlatPanelDisplay,
    Photovoltaics,
    HeatTransferFluid,
    Accelerators,
    DisposalElectricalEquipment,
    ManufactureElectricalEquipment,
    MedicalApplications,
    MilitaryApplications,
    Incineration,
    FreightRailFactors,
    MunicipalWaterTariff,
    NetZeroFactor
  ])],

  controllers: [
    NetZeroFactorController,
    EmissionController,
    FuelFactorController,
    FuelController,
    FuelPriceController,
    FuelSepecificController,
    BiologicalTreatmentSolidWasteController,
    WasteIncinerationController,
    OpenBurningOfWasteController,
    IndustrialWWTreatmentDischargeController,
    DefraController,
    DomesticWWTreatmentDischargeController,
    SolidWasteDisposalController,
    TransportController,
    FreightWaterFacController,
    CommonEmissionFactorController,
    LubricantUseController,
    ParaffinWaxUseController,
    IntergratedCircuitController,
    TFTFlatPanelDisplayController,
    PhotovoltaicsController,
    HeatTransferFluidController,
    AcceleratorsController,
    DisposalElectricalEquipmentController,
    ManufactureElectricalEquipmentController,
    MedicalApplicationsController,
    MilitaryApplicationsController,
    IncinerationController,
    FreightRailFactorsController,
    MunicipalWaterTariffController,
    EmissionFacBaseController,


  ],

  providers: [
    NetZeroFactorService,
    EmissionService,
    ElectricityService,
    CommonEmissionFactorService,
    GeneratorService,
    FuelFactorService,
    FuelService,
    FuelPriceService,
    FuelSpecificService,
    BiologicalTreatmentSolidWasteService,
    CookingService,
    FireExtinguisherService,
    RefrigerantService,
    GasBiomassService,
    WeldingEsService,
    ForkliftsService,
    BoilerService,
    WasteWaterTreatmentService,
    MunicipalWaterService,
    UnitConversionService,
    MasterDataService,
    FreightRailService,
    FreightRoadService,
    FreightWaterService,
    FreightAirService,
    FreightOffroadService,
    PassengerAirService,
    PassengerOffroadService,
    PassengerRailService,
    PassengerRoadService,
    PassengerWaterService,
    WasteDisposalService,
    CookingGasService,
    OffroadMachineryService,
    WasteIncinerationService,
    OpenBurningOfWasteService,
    IndustrialWWTreatmentDischargeService,
    DefraService,
    DomesticWWTreatmentDischargeService,
    SolidWasteDisposalService,
    TransportService,
    FreightWaterFacService,
    LubricantUseService,
    ParaffinWaxUseService,
    IntergratedCircuitService,
    TFTFlatPanelDisplayService,
    PhotovoltaicsService,
    HeatTransferFluidService,
    AcceleratorsService,
    DisposalElectricalEquipmentService,
    ManufactureElectricalEquipmentService,
    MedicalApplicationsService,
    MilitaryApplicationsService,
    IncinerationService,
    FreightRailFactorsService,
    MunicipalWaterTariffService,
    EmissionFacBaseService,
    TNDLossService,
    PurchasedGoodsAndServicesService,
    NetZeroBusinessTravelService,
    InvestmentsService,
    fuelEnergyRelatedActivitiesService,
    eoltOfSoldProductsService,
    ProcessingOfSoldProductsService,
    NetZeroEmployeeCommutingService,
    fuelEnergyRelatedActivitiesService,
    UpstreamTransportationService,
    WasteGeneratedInOperationsService,
    upstreamLeasedAssetsService,
    FranchisesService,
    DownstreamTransportationService,
    DownstreamLeasedAssetsService,

    FranchisesService,

    NetZeroUseOfSoldProductsService,
    CapitalGoodsService
  ]
})
export class EmissionModule { }
