import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { AddressAutocompleteComponent } from './address-autocomplete/address-autocomplete';
import { AddressAutocompleteModalComponent } from './address-autocomplete/address-autocomplete-modal';

@NgModule({
	declarations: [
		AddressAutocompleteComponent,
		AddressAutocompleteModalComponent
	],
	imports: [
		IonicModule,
		TranslateModule
	],
	exports: [
		AddressAutocompleteComponent,
		AddressAutocompleteModalComponent
	]
})
export class ComponentsModule { }
