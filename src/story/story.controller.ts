import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common'
import { StoryService } from './story.service'
import { CreateStoryDto } from './dto/create-story.dto'
import { Story } from './entities/story.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { noop } from 'rxjs';

@ApiTags('Story(스토리)')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ 
    summary: '이야기 생성', 
    description: '제목과 첫 문장을 입력하면 이야기를 만들어줍니다.' 
  })
  @ApiBody({ type: CreateStoryDto })
  @Post()
  public async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
    return await this.storyService.createStory(createStoryDto)
  }

  @ApiOperation({ 
    summary: '선택지에 맞는 이야기 생성', 
    description: '선택지를 선택하면 그에 맞는 뒷 이야기를 만들어줍니다.' 
  })
  @Post(':id/continue/:choiceIndex')
  async continueStory(
    @Param('id') id: number,
    @Param('choiceIndex') choiceIndex: number,
  ): Promise<Story> {
    return this.storyService.continueStory(id, choiceIndex);
  }

  @ApiOperation({
    summary: '모든 이야기 정보 조회',
    description: '이야기 정보들을 불러옵니다.'
  })
  @Get()
  public async findAll(): Promise<{ success: boolean; body: Story[] }> {
    const storys = await this.storyService.findAllStory()

    return {
      success: true,
      body: storys
    }
  }

  @ApiOperation({
    summary: '하나의 이야기 정보만 조회',
    description: '이야기를 불러옵니다.'
  })
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

  @ApiOperation({
    summary: '이야기 정보 삭제',
    description: '이야기를 삭제합니다.'
  })
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
