import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app_main/app.config';
import { App } from './app/app_main/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
