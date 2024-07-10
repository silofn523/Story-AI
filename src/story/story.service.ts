import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStoryDto } from './dto/create-story.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Story } from './entities/story.entity'
import { Repository } from 'typeorm'
import OpenAI from 'openai'

@Injectable()
export class StoryService {
  private openAi: OpenAI

  constructor(
    @InjectRepository(Story)
    private readonly story: Repository<Story>
  ) {
    this.openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  public async generateStory(prompt: string): Promise<string> {
    const completion = await this.openAi.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `${prompt}를 첫 문장으로 시작하는 이야기를 써` }],
      max_tokens: 500
    })
    return completion.choices[0].message.content
  }

  public async generateChoices(prompt: string): Promise<string[]> {
    const completion = await this.openAi.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: `${prompt}이야기를 이어갈 만한 선택지를 3개만 줘 짧게 20자 내외로` }],
      max_tokens: 100
    })
    const choicesString = completion.choices[0].message.content
    return choicesString
      .split('\n')
      .map((choice) => choice.trim())
      .filter((choice) => choice.length > 0)
  }

  public async generateEnding(prompt: string): Promise<string> {
    const completion = await this.openAi.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: `${prompt} 이야기를 자연스럽게 끝내줘` }],
      max_tokens: 200
    })
    return completion.choices[0].message.content
  }

  public async generateImage(prompt: string): Promise<string> {
    const response = await this.openAi.images.generate({
      model:'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    })
    return response.data[0].url
  }

  public async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    const { title, prompt } = createStoryDto
    const content = await this.generateStory(prompt)
    const choices = await this.generateChoices(prompt)
    const imageUrl = await this.generateImage(prompt)

    const story = this.story.create({
      title,
      content,
      choices,
      imageUrl
    })
    return await this.story.save(story)
  }

  public async continueStory(id: number, choiceIndex: number): Promise<Story> {
    const existingStory = await this.story.findOneBy({ id })

    if (!existingStory) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 스토리를 찾지 못했습니다`
      })
    }
    const selectedChoice = existingStory.choices[choiceIndex]
    const continuation = await this.generateStory(selectedChoice)
    const imageUrl = await this.generateImage(selectedChoice)

    existingStory.content += ` ${continuation}`
    existingStory.continuationCount += 1
    existingStory.imageUrl = imageUrl

    if (existingStory.continuationCount >= 2) {
      const ending = await this.generateEnding(existingStory.content)

      existingStory.content += ` ${ending}`
      existingStory.choices = []
    } else {
      const newChoices = await this.generateChoices(existingStory.content)

      existingStory.choices = newChoices
    }

    console.log(existingStory.choices[choiceIndex])

    return await this.story.save(existingStory)
  }

  public async getOneStory(id: number): Promise<Story> {
    return await this.story.findOneBy({ id })
  }

  public async findAllStory(): Promise<Story[]> {
    return await this.story.find()
  }

  public async deleteStory(id: number): Promise<void> {
    await this.story.delete({ id })
  }
}
