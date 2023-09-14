import { ApplicationConfig } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

export const appConfig: ApplicationConfig = {
  providers: [GlobalService],
};
