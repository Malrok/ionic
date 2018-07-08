import { Component, forwardRef, NgZone, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavParams, Searchbar, ViewController } from 'ionic-angular';
import { Address } from '../../models/address';
import { AddressDetails } from '../../models/address-details';

/**
 * Google declaration provides access to Google maps api
 */
declare var google: any;

/**
 * Component providing a searchbar input which autocomplete returned by Google Maps API
 */
@Component({
  selector: 'mv-address-autocomplete-modal',
  templateUrl: 'address-autocomplete-modal.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteModalComponent),
      multi: true
    }
  ]
})
export class AddressAutocompleteModalComponent implements ControlValueAccessor {
  @ViewChild('search') searchBar: Searchbar;

  /**
   * Boolean that indicates if the "custom address he typed could be presented on the list"
   */
  allowCustom: boolean;

  /**
   * Boolean that indicates if user can validate the "custom address he typed or not"
   */
  customEnabled: boolean;

  /**
   * The component needs a label option to fill the placeholder
   */
  label: string;

  /**
   * Boolean that indicates if the component will return the full detailed address or not.
   */
  private fullAddressDetails: boolean;

  /**
   * The component needs a model (ngModel od formControlName) option that will store the returned address
   */
  private _addressValue: Address;

  /**
   * {string} Address formatted as it will appear in the dom
   */
  private _displayedAddressValue = '';

  /**
   * True if the input address will be used as is
   */
  private useInputAddress: boolean;

  /**
   * Google autocomplete service
   */
  private autocompleteService = new google.maps.places.AutocompleteService();

  /**
   * Google place service
   */
  private placeService;

  /**
   * Google geocoder service
   */
  private geocoder;

  /**
   * Results received from Google services
   */
  public results = [];

  private get addressValue(): Address {
    return this._addressValue;
  }

  private set addressValue(val: Address) {
    this.ngZone.run(() => {
      this._addressValue = val;
      this.propagateChange(this._addressValue);
    });
  }

  private get displayedAddressValue() {
    return this._displayedAddressValue;
  }

  private set displayedAddressValue(val) {
    this.ngZone.run(() => {
      this._displayedAddressValue = val;
    });
  }

  constructor(
    private ngZone: NgZone,
    private params: NavParams,
    private viewCtrl: ViewController
  ) { }

  ionViewDidEnter() {
    this.label = this.params.get('label');
    this.allowCustom = this.params.get('allowCustom');
    this.customEnabled = false;
    this.fullAddressDetails = this.params.get('fullAddressDetails');
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 500);
  }

  /**
   * Empties the propositions list.
   * Called before its filling or when there are not results from Google services
   */
  private setList(results = null) {
    this.ngZone.run(() => {
      this.results = results || [];
    });
  }

  /**
   * When the input loses the focus, this method is called to hide the propositions list.
   */
  public onBlur() {
    // we need a timeout to prevent list from being emptied before the click event is emitted
    setTimeout(() => this.setList(), 300);
  }

  /**
   * This method is part of ControlValueAccessor interface.
   * Its role is to set value from the model to the DOM
   *
   * @param value Value given from the model
   */
  public writeValue(value: any) {
    if (value && value.formattedAddress) {
      this.displayedAddressValue = value.formattedAddress;
    } else {
      this.displayedAddressValue = null;
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

  /**
  * When user type something in the searchbar,
  * this method updates the formatted address of the address model.
  * This also calls the method responsible of filling the propositions list with AutocompleteService.
  */
  public inputOnSearchbar(disableCustom: boolean) {
    if (this.displayedAddressValue) {
      this.addressValue = {
        formattedAddress: this.displayedAddressValue
      };
    } else {
      this.addressValue = null;
    }
    if (this.customEnabled && disableCustom) {
      this.customEnabled = false;
    } else {
      // Nothing to do...
    }
    if (this.addressValue) {
      this.useAutocompleteservice();
    } else {
      this.setList();
    }
  }

  /**
   * This method calls the autocomplete service to get predictions based on the input value.
   * If there are some results, they wil fill the propositions list.
   * Else, Google geocoding will be called
   */
  private useAutocompleteservice() {
    this.useInputAddress = false;
    if (this.displayedAddressValue === '') {
      this.setList();
      return;
    }
    this.autocompleteService.getPlacePredictions({ input: this.displayedAddressValue },
      (results, status) => {
        if (results && results.length > 0) {
          this.setList(results);
          this.ngZone.run(() => {
            if (!this.customEnabled) {
              this.customEnabled = true;
            } else {
              // Nothing to do...
            }
          });
        } else {
          this.useGeocoding();
        }
      });
  }

  /**
   * This method calls the Google geocoding to get predictions based on the input value.
   * If there are some results, they wil fill the propositions list.
   */
  private useGeocoding() {
    this.useInputAddress = true;
    const request = {
      address: this.displayedAddressValue
    };
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    this.geocoder.geocode(request, (results, status) => {
      this.setList(results);
      this.ngZone.run(() => {
        if (!this.customEnabled) {
          this.customEnabled = true;
        } else {
          // Nothing to do...
        }
      });
    });
  }

  /**
   * This method is called when the user validates input without any result,
   * the address only contains the formatted address entered in the search bar
   */
  selectCustomAddress() {
    this.viewCtrl.dismiss(this.addressValue);
  }

  /**
   * This method is called when user select a proposition in the list.
   * The Google PlaceService is called to get precise informations about this place.
   * the address object is built with those informations.
   *
   * @param item Selected item from propositon list
   */
  public selectSearchResult(item) {
    if (this.fullAddressDetails) {
      const request = {
        placeId: item.place_id
      };
      if (!this.placeService) {
        this.placeService = new google.maps.places.PlacesService(document.getElementById('attribution'));
      }
      this.placeService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.displayedAddressValue = place.formatted_address;
          const addressDetails: AddressDetails = {
            route: '',
            postalCode: '',
            city: '',
            country: ''
          };
          for (const component of place.address_components) {
            if (component.types[0] === 'street_number') {
              addressDetails.streetNumber = component.long_name;
            }
            if (component.types[0] === 'route') {
              addressDetails.route = component.long_name;
            }
            if (component.types[0] === 'postal_code') {
              addressDetails.postalCode = component.long_name;
            }
            if (component.types[0] === 'locality') {
              addressDetails.city = component.long_name;
            }
            if (component.types[0] === 'country') {
              addressDetails.country = component.long_name;
            }
          }
          this.addressValue = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            formattedAddress: this.useInputAddress ? this.displayedAddressValue : place.formatted_address,
            googlePlaceId: place.place_id,
            addressDetails: addressDetails
          };
        } else {
          console.log('place service answer status = ', status);
        }
        this.viewCtrl.dismiss(this.addressValue);
      });
    } else {
      this.addressValue = {
        formattedAddress: item.description || item.formatted_address,
        googlePlaceId: item.place_id
      };
      this.viewCtrl.dismiss(this.addressValue);
    }
    this.setList();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
