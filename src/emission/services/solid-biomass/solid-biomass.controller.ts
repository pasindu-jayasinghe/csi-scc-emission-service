import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SolidBiomassService } from './solid-biomass.service';
import { CreateSolidBiomassDto } from './dto/create-solid-biomass.dto';
import { UpdateSolidBiomassDto } from './dto/update-solid-biomass.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('solid-biomass')
export class SolidBiomassController {
  constructor(private readonly solidBiomassService: SolidBiomassService) {}

  @Post()
  create(@Body() createSolidBiomassDto: CreateSolidBiomassDto) {
    return this.solidBiomassService.create(createSolidBiomassDto);
  }

  @Get()
  findAll() {
    return this.solidBiomassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solidBiomassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolidBiomassDto: UpdateSolidBiomassDto) {
    return this.solidBiomassService.update(+id, updateSolidBiomassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solidBiomassService.remove(+id);
  }
}
