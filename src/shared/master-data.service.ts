import { Injectable } from "@nestjs/common";

@Injectable()
export class MasterDataService {
    private _conversions;

    constructor() {
        this.conversions = {
            CELCIUSToFAHRENHEIT: {
                "fromUnit": "Celcius",
                "toUnit": "Fahrenheit",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 9,
                        "order": 1
                    },
                    {
                        "operator": "/",
                        "factor": 5,
                        "order": 2
                    },
                    {
                        "operator": "+",
                        "factor": 32,
                        "order": 3
                    }
                ]
            },
            fahrenheitTocelcius: {
                "fromUnit": "Fahrenheit",
                "toUnit": "Celcius",
                "operators": [
                    {
                        "operator": "-",
                        "factor": 32,
                        "order": 1
                    },
                    {
                        "operator": "*",
                        "factor": 5,
                        "order": 2
                    },
                    {
                        "operator": "/",
                        "factor": 9,
                        "order": 3
                    }
                ]
            },
            LToM3: {
                "fromUnit": "Liters",
                "toUnit": "m3",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            },
            M3ToL: {
                "fromUnit": "m3",
                "toUnit": "Liters",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 1000,
                        "order": 1
                    },
                ]
            },
            GToKG: {
                "fromUnit": "g",
                "toUnit": "kg",
                "operators": [
                    {
                        "operator": "/",
                        "factor": 1000,
                        "order": 1
                    },
                ]
            },
            TToKG: {
                "fromUnit": "Mt",
                "toUnit": "kg",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 1000,
                        "order": 1
                    },
                ]
            },
            KGToT: {
                "fromUnit": "kg",
                "toUnit": "Mt",
                "operators": [
                    {
                        "operator": "/",
                        "factor": 1000,
                        "order": 1
                    },
                ]
            },
            NMToKM: {
                "fromUnit": "Nm",
                "toUnit": "km",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 1.852,
                        "order": 1
                    },
                ]
            },
            KWHToMWH: {
                "fromUnit": "KWH",
                "toUnit": "MWH",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            },
            KGCO2EM2YToTCO2EM2Y: {
                "fromUnit": "KGCO2EM2Y",
                "toUnit": "TCO2EM2Y",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            },
            KGCO2EBAYToTCO2EBAY: {
                "fromUnit": "KGCO2EBAY",
                "toUnit": "TCO2EBAY",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            },
            KGCO2EM3ToTCO2EM3: {
                "fromUnit": "KGCO2EM3",
                "toUnit": "TCO2EM3",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            },
            KGCO2EToTCO2: {
                "fromUnit": "KGCO2E",
                "toUnit": "TCO2",
                "operators": [
                    {
                        "operator": "*",
                        "factor": 0.001,
                        "order": 1
                    },
                ]
            }

        }
    }

    set conversions(value) {
        this._conversions = value;
    }

    get conversions() {
        return this._conversions;
    }
}