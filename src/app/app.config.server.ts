import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { ServerInterceptor } from './server.interceptor';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { authInterceptor } from './interceptors/auth.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideHttpClient(
      withFetch(),
      withInterceptors([ServerInterceptor.intercept, authInterceptor])
    ),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
