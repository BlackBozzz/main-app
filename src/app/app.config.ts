import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideArgentWebapp} from '@argent/webapp-common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideArgentWebapp({
      dictionary: {
        apiBaseUrl: '/api/argent-dictionary',
      },
    }),
  ]
};
