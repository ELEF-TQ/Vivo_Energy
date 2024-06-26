import { Module } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { ConversionsController } from './conversions.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Conversion, ConversionSchema } from './schemas/conversion.schema';
import { PompistesModule } from 'src/pompistes/pompistes.module';
import { Pompiste, PompisteSchema } from 'src/pompistes/schemas/pompiste.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Conversion.name,schema: ConversionSchema},
    { name: Pompiste.name, schema: PompisteSchema} 
  ],),
  PompistesModule],
  controllers: [ConversionsController],
  providers: [ConversionsService],
  exports: [ConversionsService]
})
export class ConversionsModule {}
