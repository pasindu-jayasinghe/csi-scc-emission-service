export enum ParamterUnit {

    boiler_consumption_furnanceOil = 'L',
    boiler_consumption_solidBiomass = 'KG',
    cooking_gas_consumption = 'KG',
    electricity_consumption = 'MWH',
    fire_extinguisher_wwpt = 'KG',
    forklift_consumption = 'L',
    generator_vol = 'L',
    generator_currency = 'LKR',
    municipal_water_vol = "M3",
    refrigerant_W_RG = 'KG',


    fuel_energy_related_activities_vol = "L",

    waste_water_tip = 'TYR',
    waste_water_wasteGenerated = 'M3T',
    waste_water_cod = 'KGCODM3',
    waste_water_sludgeRemoved = 'KGCODYR',
    waste_water_recoveredCh4 = 'KGCH4YR',

    welding_es_ac = 'KG',
    welding_es_lc = 'KG',

    passenger_road_fc = "L",
    business_travel_fc = "L",
    passenger_road_distance = 'KM',
    business_travel_distance = 'KM',
    passenger_road_distance_public = 'PKM',
    passenger_road_fe = 'KML',
    business_travel_fe = 'KML',
    passenger_offroad_fc = 'L',
    passenger_offroad_distance = 'KM',
    passenger_offroad_fe = 'KML',
    passenger_rail_fc_vol = 'L',
    passenger_rail_fc_weight = 'KG',
    passenger_rail_distance = 'KM',
    passenger_rail_distance_passenger = 'PKM',
    passenger_rail_fe = 'KML',

    freight_air_distance = 'KM',
    freight_air_weight = 'T',
    freight_offroad_fc = 'L',
    freight_rail_fc = 'L',
    freight_rail_weight = 'KG',
    freight_rail_dist_weight = 'T',
    freight_rail_dist = 'KM',
    freight_road_fc = 'L',
    freight_road_distance = 'KM',
    freight_road_weight = 'T',
    freight_road_fe = 'KML',
    freight_water_fc_t = 'T',
    freight_water_fc_l = 'L',
    freight_water_fc_net = 'KWHNETCV',
    freight_water_fc_gross = 'KWHGROSSCV',
    freight_water_distance = 'KM',
    freight_water_weight = 'T',

    waste_disposal_unit = 'T',

    purchase_good_services_supplier_quantity = 'KG',
    purchase_good_services_supplier_ef = 'KGCO2EKG',
    purchase_good_services_hybrid_purchase = 'KGCO2E',
    purchase_good_services_hybrid_material_amount = 'KG',
    purchase_good_services_hybrid_material_amount_ef = 'KGCO2EKG',
    purchase_good_services_hybrid_trans_distance = 'KM',
    purchase_good_services_hybrid_trans_mass = 'T',
    purchase_good_services_hybrid_trans_ef = 'KGCO2ETKM',
    purchase_good_services_hybrid_waste_amount = 'KG',
    purchase_good_services_average_method_mass = 'KG',
    purchase_good_services_average_method_reference = 'PIECE',
    purchase_good_services_average_method_mass_ef = 'KGCO2EKG',
    purchase_good_services_average_method_reference_ef = 'KGCO2EPIECE',
    
    net_zero_business_travel_fuel='L',
    net_zero_business_travel_grid='KWH',
    net_zero_business_travel_distance='KM',
    net_zero_business_travel_amount='USD',
    net_zero_business_travel_passenger = 'PKM',
    net_zero_business_travel_vehicle = 'VKM',

    mass_of_sold_intermediate_product = 'KG',
    mass_of_waste_output = 'KG',
    fuel_consumed = 'L',
    electricity_consumed = 'KWH',

    net_zero_employee_commuting_fuel = 'L',
    net_zero_employee_commuting_grid = 'KWH',
    net_zero_employee_commuting_distance = 'KM',
    net_zero_employee_commuting_passenger = 'PKM',
    net_zero_employee_commuting_vehicle = 'VKM',

    use_of_sold_product_fuel = 'L',
    use_of_sold_product_grid = 'KWH',
    use_of_sold_product_ref = 'KG',
   


    waste_generated_in_operations_scope='TCO2',
    waste_generated_in_operations_waste_produced_solid='T',
    waste_generated_in_operations_waste_produced_water='M3',
    waste_generated_in_operations_mass_waste='T',
   
    franchises_emission_unit = 'TCO2',
    franchises_area_unit = 'M2',
    franchises_energy_unit = 'KWH',
    franchises_average_ef_unit = 'TCO2EM2Y',
    franchises_average_per_building_ef_unit = 'TCO2EBAY',


    downstream_vol = "M3",
    downstream_average_ef_unit = "TCO2EM3",
    downstream_fuel = 'L',
    downstream_electricity_consumption = 'MWH',


    upstream_vol = "M3",
    upstream_average_ef_unit = "TCO2EM3",
    uptream_fuel = 'L',
    upstream_electricity_consumption = 'MWH',

    //capital goods
    capital_goods_quantity_unit_01 = "M2",
    // capital_goods_quantity_unit_02 = "qty",
    capital_goods_ef_unit_01 = "tco2e/m2",
    // capital_goods_ef_unit_02 = "tco2e/qty",


}

export const currencies = ["LKR", "USD"]
export const volumes = ["L", "ML"]
export const distances = ['KM', 'M']
export const passengerDistances = ['PKM']