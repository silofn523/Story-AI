import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class Story extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsString()
  @IsNotEmpty()
  public readonly title: string

  @Column('text')
  @IsString()
  @IsNotEmpty()
  public content: string

  @Column('simple-array')
  @IsString()
  @IsNotEmpty()
  public choices: string[]

  @Column({nullable: true})
  @IsString()
  @IsNotEmpty()
  public imageUrl: string

  @Column({ default: 0 })
  @IsNumber()
  public continuationCount: number; // 새로운 속성 추가
}
