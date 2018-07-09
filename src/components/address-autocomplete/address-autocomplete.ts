
import { Component, forwardRef, Input, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import * as firebase from 'firebase';
import { ModalController } from 'ionic-angular';
import { Address } from '../../models/address';
import { AddressAutocompleteModalComponent } from './address-autocomplete-modal';

const OPTIONS: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 5
};

/**
 * Component providing a searchbar input which autocomplete returned by Google Maps API
 */
@Component({
  selector: 'mv-address-autocomplete',
  templateUrl: 'address-autocomplete.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true
    }
  ]
})
export class AddressAutocompleteComponent implements ControlValueAccessor {
  /**
   * The component needs a label option to fill the placeholder
   */
  @Input()
  label: string;

  /**
   * Boolean that indicates if the component will accept custom value or not.
   */
  @Input()
  allowCustom: boolean;

  /**
   * Boolean that indicates if the component will return the full detailed address or not.
   */
  @Input()
  fullAddressDetails: boolean;

  /**
   * Address value
   */
  private _addressValue: Address = {
    latitude: 0,
    longitude: 0,
    formattedAddress: '',
    googlePlaceId: '',
    addressDetails: {
      streetNumber: '',
      route: '',
      postalCode: '',
      city: '',
      country: ''
    }
  };

  private isModalPresented = false;

  public get addressValue(): Address {
    return this._addressValue;
  }

  public set addressValue(val: Address) {
    this.ngZone.run(() => {
      this._addressValue = val;
    });
  }

  constructor(
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private nativeGeocoder: NativeGeocoder
  ) { }

  /**
   * Open a modal with searchbar and results list.
   */
  public openModal() {
    console.log('openModal');
    if (!this.isModalPresented) {
      const addressAutocompleteModal = this.modalCtrl.create(AddressAutocompleteModalComponent, {
        label: this.label,
        allowCustom: this.allowCustom,
        fullAddressDetails: this.fullAddressDetails
      });
      addressAutocompleteModal.onDidDismiss((newAddress: Address) => {
        if (newAddress && newAddress.formattedAddress) {
          this.addressValue = newAddress;
          const geopoint = new firebase.firestore.GeoPoint(newAddress.latitude, newAddress.longitude);
          this.propagateChange(geopoint);
        }
        this.isModalPresented = false;
      });
      addressAutocompleteModal.present();
      this.isModalPresented = true;
    }
  }

  /**
   * This method is part of ControlValueAccessor interface.
   * Its role is to set value from the model to the DOM
   *
   * @param value Value given from the model
   */
  writeValue(geopoint: firebase.firestore.GeoPoint): void {
    console.log('writeValue: ', geopoint);
    if (geopoint) {
      this.nativeGeocoder.reverseGeocode(geopoint.latitude, geopoint.longitude, OPTIONS)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log(JSON.stringify(result[0]));
          this._addressValue.formattedAddress = result[0].subThoroughfare + ' ' + result[0].thoroughfare + ' ' + result[0].postalCode + ' ' + result[0].locality + ' ' + result[0].countryName;
        })
        .catch((error: any) => console.log(error));
    } else {
      this._addressValue = {
        latitude: 0,
        longitude: 0,
        formattedAddress: '',
        googlePlaceId: '',
        addressDetails: {
          streetNumber: '',
          route: '',
          postalCode: '',
          city: '',
          country: ''
        }
      }
    }
  }

  /**
   * This method is part of ControlValueAccessor interface.
   * Its role is to set the function that will propagate changes from the DOM to the model.
   *
   * @param fn {function} Angular internal function
   */
  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * This method is part of ControlValueAccessor interface.
   * Not used here
   */
  public registerOnTouched(): void { }

  /**
   * Container for the propagation function.
   */
  public propagateChange = (_: any) => { };
}
