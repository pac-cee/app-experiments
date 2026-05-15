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

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  rides: number;
}

export interface CustomerRequest {
  id: string;
  customer: CustomerInfo;
  pickup: Location;
  destination: Location;
  vehicleType: VehicleType;
  distanceFromRider: number;
  requestedAt: string;
  status: "pending" | "accepted" | "rejected";
}

export interface RideRecord {
  id: string;
  date: string;
  pickup: Location;
  destination: Location;
  rider: Rider;
  price: number;
  status: "completed" | "cancelled";
  rating?: number;
}

export interface JobRecord {
  id: string;
  date: string;
  customer: CustomerInfo;
  pickup: Location;
  destination: Location;
  price: number;
  status: "completed" | "cancelled";
  rating?: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo?: string;
  role?: UserRole;
  status?: UserStatus;
  nationalId?: string;
  homeAddress?: string;
  vehicleType?: VehicleType;
  plate?: string;
}

export const KIGALI_LOCATIONS: Location[] = [
  { id: "l1", name: "Kigali CBD", address: "KN 4 Ave, Nyarugenge", lat: -1.9441, lng: 30.0619 },
  { id: "l2", name: "Kimironko Market", address: "KG 9 Ave, Gasabo", lat: -1.9357, lng: 30.1121 },
  { id: "l3", name: "Nyamirambo", address: "KN 21 Rd, Nyarugenge", lat: -1.9776, lng: 30.0476 },
  { id: "l4", name: "Remera", address: "KG 15 Ave, Gasabo", lat: -1.9557, lng: 30.1082 },
  { id: "l5", name: "Kigali Airport", address: "KK 15 Rd, Kicukiro", lat: -1.9690, lng: 30.1395 },
  { id: "l6", name: "Kicukiro Center", address: "KK 8 Ave, Kicukiro", lat: -2.0000, lng: 30.0850 },
  { id: "l7", name: "Gikondo", address: "KK 19 Rd, Kicukiro", lat: -1.9780, lng: 30.0820 },
  { id: "l8", name: "Gisozi", address: "KG 3 Ave, Gasabo", lat: -1.9222, lng: 30.0638 },
  { id: "l9", name: "Kacyiru", address: "KG 5 Ave, Gasabo", lat: -1.9322, lng: 30.0741 },
  { id: "l10", name: "Muhima", address: "KN 8 Rd, Nyarugenge", lat: -1.9531, lng: 30.0568 },
  { id: "l11", name: "Nyabugogo", address: "KN 2 Rd, Nyarugenge", lat: -1.9350, lng: 30.0458 },
  { id: "l12", name: "Sonatubes", address: "KG 11 Ave, Gasabo", lat: -1.9621, lng: 30.0990 },
  { id: "l13", name: "Kanombe", address: "KK 7 Ave, Kicukiro", lat: -1.9750, lng: 30.1300 },
  { id: "l14", name: "Rebero", address: "KG 20 Ave, Gasabo", lat: -1.9680, lng: 30.0950 },
];

export const MOCK_RIDERS: Rider[] = [
  { id: "r1", name: "Jean Pierre Mugisha", phone: "+250788123456", rating: 4.8, rides: 234, plate: "RAD 234B", vehicle: "moto", lat: -1.9480, lng: 30.0650, verified: true },
  { id: "r2", name: "Claude Hakizimana", phone: "+250788234567", rating: 4.6, rides: 156, plate: "RAC 567A", vehicle: "cab", lat: -1.9380, lng: 30.0750, verified: true },
  { id: "r3", name: "Diane Uwimana", phone: "+250788345678", rating: 4.9, rides: 312, plate: "RAB 891C", vehicle: "moto", lat: -1.9550, lng: 30.0590, verified: true },
