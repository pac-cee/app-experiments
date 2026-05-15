import { MOCK_RIDERS, MOCK_RIDE_HISTORY, Rider, RideRecord, VehicleType, Location } from "./mockData";

export async function getNearbyRiders(vehicleType?: VehicleType): Promise<Rider[]> {
  await delay(500);
  if (!vehicleType) return MOCK_RIDERS;
  return MOCK_RIDERS.filter((r) => r.vehicle === vehicleType);
}

export async function confirmBooking(params: {
  riderId: string;
  pickup: Location;
  destination: Location;
  price: number;
}): Promise<{ success: boolean; bookingId: string }> {
  await delay(800);
  return { success: true, bookingId: "bk_" + Date.now() };
}

export async function getRideHistory(_userId: string): Promise<RideRecord[]> {
  await delay(600);
  return MOCK_RIDE_HISTORY;
}

export async function rateRide(rideId: string, rating: number, _comment?: string): Promise<{ success: boolean }> {
  await delay(500);
  console.log(`Rated ride ${rideId}: ${rating} stars`);
  return { success: true };
}

export function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
