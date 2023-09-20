import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('uploads/:filename')
  responseFile(
    @Param('filename') filename: string,
    @Res() res,
  ): Observable<object> {
    return res.sendFile(join(__dirname, '..', 'uploads', filename));
  }
}
