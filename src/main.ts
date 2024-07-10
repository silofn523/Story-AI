import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as expressBasicAuth from 'express-basic-auth'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    ['/api', '/api-jsom'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PW,
      }
    }),
  )
  const config = new DocumentBuilder()
    .setTitle('API문서')
    .setDescription('API 문서임 ㅇㅇ')
    .setVersion('0.0')
    .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
