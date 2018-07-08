import { AddressDetails } from './address-details';

export interface Address {
    latitude?: number;
    longitude?: number;
    formattedAddress: string;
    googlePlaceId?: string;
    addressDetails?: AddressDetails;
}