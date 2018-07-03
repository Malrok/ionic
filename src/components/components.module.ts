import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { AddressComponent } from './address/address';

@NgModule({
	declarations: [AddressComponent],
	imports: [
		IonicModule,
		TranslateModule
	],
	exports: [AddressComponent]
})
export class ComponentsModule { }
