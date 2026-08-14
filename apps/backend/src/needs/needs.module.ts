import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedEntity } from './need.entity';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NeedEntity])],
  controllers: [NeedsController],
  providers: [NeedsService],
  exports: [NeedsService],
})
export class NeedsModule {}
