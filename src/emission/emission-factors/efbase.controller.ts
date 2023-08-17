import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common/decorators";
import { efType } from "../enum/ef-type.enum";
import { EmissionFacBaseService } from "./efbase.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { efCodeNameDto } from "./efcodename.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";




@UseGuards(JwtAuthGuard)
@Controller('ef-base')
export class EmissionFacBaseController {
  constructor(
    private emissionfacBaseService: EmissionFacBaseService
  ) { }



  @Post('get-variable-mapping')
  async getVariableMapping(
    @Query('efType') efType: efType,
  ): Promise<efCodeNameDto> {
    return this.emissionfacBaseService.getVariableMapping(efType)
  }


  @Post('upload-bulk')
  @UseInterceptors(FileInterceptor('file'))
  uploadBulk(@UploadedFile() file: Express.Multer.File,
    @Query('efType') efType: efType,) 
    {
      console.log("eee",efType)
    return this.emissionfacBaseService.uploadBulk(efType, file.buffer);
    }


}