import { Module } from '@nestjs/common'
import { StoryService } from './story.service'
import { StoryController } from './story.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Story } from './entities/story.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  controllers: [StoryController],
  providers: [StoryService]
})
export class StoryModule {}
