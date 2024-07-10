import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  public readonly title: string

  @IsString()
  @IsNotEmpty()
  public readonly prompt: string // 첫문장

}
