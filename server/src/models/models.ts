export interface ShipmentFilters {
  status?: ShipmentStatus;
  weightCategory?: WeightCategory;
  originZipCode?: string;
  destinationZipCode?: string;
  shipmentNumber?: string;
}

export enum ShipmentStatus {
  RECEIVED_ORIGIN = "Received and processed in the parcel centre of origin",
  RECEIVED_DESTINATION = "Received and processed in the destination parcel centre",
  DELIVERED = "Delivered",
}

export enum WeightCategory {
  LIGHT = "Less than 1kg",
  MEDIUM = "Between 1kg and 5kg",
  HEAVY = "More than 5kg",
}
