import { Injectable } from '@nestjs/common';
import { MasterDataService } from 'src/shared/master-data.service';
import { UnitConversionResDto } from './dto/unit-conversion-res.dto';

@Injectable()
export class UnitConversionService {

  constructor(
    private masterDataService: MasterDataService
  ){}
 
  public convertUnit(value: number, fromUnit: string, toUnit: string) {
    let response = new UnitConversionResDto()
    let conversionCode = fromUnit.toUpperCase() + "To" + toUnit.toUpperCase()
    console.log("mmm",conversionCode)
    let data = this.masterDataService.conversions[conversionCode]
    let equation = value.toString()
    data.operators.sort((a: any, b: any) => a.order - b.order);
    for (let operator of data.operators){
      equation = "(" + equation + operator.operator + operator.factor + ")"
    }
    console.log(equation)
    response.value = eval(equation)
    response.metaData = data
    return response
  }
}
