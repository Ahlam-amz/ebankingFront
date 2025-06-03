/*import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
*/

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Required Material modules
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter()
  ]
}).catch(err => console.error(err));