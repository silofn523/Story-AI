import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common'
import { StoryService } from './story.service'
import { CreateStoryDto } from './dto/create-story.dto'
import { Story } from './entities/story.entity';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  public async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
    return await this.storyService.createStory(createStoryDto)
  }

  @Post(':id/continue/:choiceIndex')
  async continueStory(
    @Param('id') id: number,
    @Param('choiceIndex') choiceIndex: number,
  ): Promise<Story> {
    return this.storyService.continueStory(id, choiceIndex);
  }

  @Get()
  public async findAll(): Promise<{ success: boolean; body: Story[] }> {
    const storys = await this.storyService.findAllStory()

    return {
      success: true,
      body: storys
    }
  }

  @Get(':id')
  public async getOneStory(@Param('id') id: number): Promise<{ success: boolean; body: Story | void }> {
    const story = await this.storyService.getOneStory(id)

    if (!story) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 이야기를 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: story
    }
  }

  @Delete(':id')
  public async deleteStory(@Param('id') id: number): Promise<{ success: boolean }> {
    const story = await this.storyService.getOneStory(id)
    await this.storyService.deleteStory(id)

    if (!story) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 이야기를 찾지 못했습니다`
      })
    }

    return {
      success: true,
    }
  }
}
