export interface AuthInfo {
    email: string;
    username: string;
    password: string;
}

export interface PostOfficeInfo {
    zipCode: string;
    name: string;
    address: string;
    index?: number;
}

export interface Shipment {
    type: ShipmentType;
    status: ShipmentStatus;
    weightCategory: WeightCategory;
    shipmentNumber: string;
    originZipCode: string;
    destinationZipCode: string;
    actualWeight: number;
}

export enum ShipmentStatus {
    RECEIVED_ORIGIN = 'Received and processed in the parcel centre of origin',
    RECEIVED_DESTINATION = 'Received and processed in the destination parcel centre',
    DELIVERED = 'Delivered',
}

export enum ShipmentType {
    LETTER = 'Letter',
    PACKAGE = 'Package',
}

export enum WeightCategory {
    LIGHT = 'Less than 1kg',
    MEDIUM = 'Between 1kg and 5kg',
    HEAVY = 'More than 5kg',
}

export const shipmentStatusOptions = Object.values(ShipmentStatus);
export const shipmentTypeOptions = Object.values(ShipmentType);
export const weightCategoryOptions = Object.values(WeightCategory);

export interface ShipmentFilters {
    status?: ShipmentStatus;
    originZipCode?: string;
    destinationZipCode?: string;
    weightCategory?: WeightCategory;
    shipmentNumber?: string;
  }
