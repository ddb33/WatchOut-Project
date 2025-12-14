import 'zone.js'; // Must be the first line
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Import the tools to merge configs
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app/app.config'; // Import the client config

// Create the Server Config locally
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <--- THIS IS THE MISSING PIECE
  ]
};

// Merge them together
const config = mergeApplicationConfig(appConfig, serverConfig);

// Start the app with the merged config
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
