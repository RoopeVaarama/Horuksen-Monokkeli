import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
//@ts-ignore
import { version } from '../package.json'; // Never do this in frontend
import { AuthGuard } from './auth/auth-guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('SERVER_PORT');

    const documentConfig = new DocumentBuilder()
        .setTitle('Horuksen Monokkeli')
        .setDescription('Horuksen Monokkeli backend API definition')
        .setVersion(version)
        .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('api', app, document); // http://localhost:3001/api
    app.enableCors()
    app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
    await app.listen(port, () => {
        console.info(`Listening on port ${port}`);
    });
}
bootstrap();
