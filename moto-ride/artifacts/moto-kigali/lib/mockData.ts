export type VehicleType = "moto" | "cab" | "truck";
export type UserRole = "customer" | "rider";
export type UserStatus = "active" | "pending" | "approved";

export type RideStatus =
  | "searching"
  | "contacted"
  | "price_agreed"
  | "rider_en_route"
  | "arrived"
  | "in_transit"
  | "completed"
  | "cancelled";

export type JobStatus = "en_route_pickup" | "at_pickup" | "in_progress" | "completed";

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  rides: number;
  plate: string;
  vehicle: VehicleType;
  lat: number;
  lng: number;
  photo?: string;
  verified: boolean;
}

