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
