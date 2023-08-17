import { Injectable } from '@nestjs/common';
import { PassengerAirDto } from './passenger-air.dto';

@Injectable()
export class PassengerAirService {
    async calculateTotalEmission(data: PassengerAirDto){
        console.log("passenger air")
    }
}
