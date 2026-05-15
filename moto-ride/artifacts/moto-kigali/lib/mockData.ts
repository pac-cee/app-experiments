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
  { id: "r4", name: "Eric Nshimiyimana", phone: "+250788456789", rating: 4.5, rides: 89, plate: "RAD 112D", vehicle: "moto", lat: -1.9420, lng: 30.0700, verified: true },
  { id: "r5", name: "Francine Mukamana", phone: "+250788567890", rating: 4.7, rides: 198, plate: "RAE 445B", vehicle: "cab", lat: -1.9610, lng: 30.0680, verified: true },
  { id: "r6", name: "Patrick Habimana", phone: "+250788678901", rating: 4.3, rides: 67, plate: "RAF 778A", vehicle: "truck", lat: -1.9500, lng: 30.0800, verified: true },
  { id: "r7", name: "Solange Ingabire", phone: "+250788789012", rating: 4.8, rides: 276, plate: "RAG 334C", vehicle: "moto", lat: -1.9350, lng: 30.0630, verified: true },
  { id: "r8", name: "Thierry Ndayishimiye", phone: "+250788890123", rating: 4.6, rides: 143, plate: "RAB 556D", vehicle: "cab", lat: -1.9680, lng: 30.0720, verified: true },
];

export const MOCK_CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: "req1",
    customer: { id: "c1", name: "Amina Uwase", phone: "+250788001001", rating: 4.9, rides: 34 },
    pickup: KIGALI_LOCATIONS[0],
    destination: KIGALI_LOCATIONS[3],
    vehicleType: "moto",
    distanceFromRider: 0.8,
    requestedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "req2",
    customer: { id: "c2", name: "David Kagabo", phone: "+250788002002", rating: 4.7, rides: 12 },
    pickup: KIGALI_LOCATIONS[8],
    destination: KIGALI_LOCATIONS[1],
    vehicleType: "moto",
    distanceFromRider: 1.4,
    requestedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "req3",
    customer: { id: "c3", name: "Grace Murekatete", phone: "+250788003003", rating: 4.8, rides: 56 },
    pickup: KIGALI_LOCATIONS[9],
    destination: KIGALI_LOCATIONS[5],
    vehicleType: "moto",
    distanceFromRider: 2.1,
    requestedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    status: "pending",
  },
