import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import * as firebase from 'firebase';

const OPTIONS: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 5
};

@Component({
  selector: 'mv-address',
  templateUrl: 'address.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressComponent),
    }
  ]
})
export class AddressComponent implements ControlValueAccessor {

  @Input()
  public label: string = '"COMPONENT.ADDRESS"';

  public get address(): string {
    return this._address;
  }

  public set address(address: string) {
    this._address = address;
    this.nativeGeocoder.forwardGeocode(this._address, OPTIONS)
      .then((coordinates: NativeGeocoderForwardResult[]) => {
        // this.onChange(coordinates)
        console.log(coordinates);
      })
      .catch((error: any) => console.log(error));
  }

  private _address: string;

  private onChange = (any) => { };

  constructor(private nativeGeocoder: NativeGeocoder) { }

  writeValue(geopoint: firebase.firestore.GeoPoint): void {
    console.log('writeValue: ', geopoint);
    this.nativeGeocoder.reverseGeocode(geopoint.latitude, geopoint.longitude, OPTIONS)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log(JSON.stringify(result[0]));
        this._address = result[0].subThoroughfare + ' ' + result[0].thoroughfare + ' ' + result[0].postalCode + ' ' + result[0].locality + ' ' + result[0].countryName;
      })
      .catch((error: any) => console.log(error));
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(): void { }

}
