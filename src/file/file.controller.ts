import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import * as path from 'path';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.middleware';

const mb = 50;
const bytes = mb * 1024 * 1024;
const rootDir = process.cwd();
const uploadPath = path.resolve(rootDir, process.env.UPLOAD_LOCATION);

export const multerOptions = {
  limits: {
    fileSize: +bytes,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${path.extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      if (!existsSync(uploadPath)) {
        throw new HttpException(
          `${uploadPath} There is no upload folder`,
          HttpStatus.NOT_FOUND,
        );
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${path.extname(file.originalname)}`);
    },
  }),
};

@Controller('file')
export class FileController {
  @Post('/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file) {
    return { url: `/uploads/${file.filename}` };
  }
}
