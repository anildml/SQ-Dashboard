import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app_main/app';
import { config } from './app/app_main/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
