import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';


console.log('DEBUG -- loading main.ts -- ' + new Date().getTime());

platformBrowserDynamic().bootstrapModule(AppModule);
