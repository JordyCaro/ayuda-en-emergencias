import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './source.entity';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
  controllers: [SourcesController],
  providers: [SourcesService],
  exports: [SourcesService, TypeOrmModule],
})
export class SourcesModule implements OnModuleInit {
  constructor(private readonly sources: SourcesService) {}

  async onModuleInit() {
    await this.sources.seedDefaults();
  }
}
