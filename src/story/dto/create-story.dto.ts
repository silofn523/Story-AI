import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class CreateStoryDto {

  @ApiProperty({ description: '이야기 제목', default: 'pm성민이의 여행' })
  @IsString()
  @IsNotEmpty()
  public readonly title: string

  @ApiProperty({ description: '이야기 첫 문장', default: '성민이는 여행을 떠난다' })
  @IsString()
  @IsNotEmpty()
  public readonly prompt: string // 첫문장

}
