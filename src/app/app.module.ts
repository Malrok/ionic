import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CONFIG } from '../../environnement/config';
import { AddressAutocompleteModalComponent } from '../components/address-autocomplete/address-autocomplete-modal';
import { ComponentsModule } from '../components/components.module';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { StorageProvider } from '../providers/storage/storage';
import { MyApp } from './app.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(CONFIG.database),
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddressAutocompleteModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirestoreProvider,
    HttpClient,
    ImagePicker,
    VirtualScrollModule,
    StorageProvider,
    NativeGeocoder
  ]
})
export class AppModule { }
