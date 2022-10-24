import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './test_pdfs' })],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
