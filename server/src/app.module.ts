import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './users/schemas/user.schema';
import { SearchModule } from './search/search.module';
import { FileModule } from './file/file.module';
import { UsersModule } from './users/users.module';
import { TemplateModule } from './template/template.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.production.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.info(`Using MongoDB URI ${uri}`);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    SearchModule,
    UsersModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
