import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';

@Injectable()
export abstract class GHGProtocolService {
    abstract calculationGHGProtocol(data: any);
}




