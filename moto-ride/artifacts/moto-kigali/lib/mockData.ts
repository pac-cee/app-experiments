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
