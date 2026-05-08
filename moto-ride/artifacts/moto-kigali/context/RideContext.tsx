import React, { createContext, useContext, useState } from "react";
import { Location, Rider, VehicleType, RideStatus } from "@/lib/mockData";

export interface ActiveRide {
  bookingId: string;
  pickup: Location;
  destination: Location;
  rider: Rider;
  price: number;
  status: RideStatus;
  agreedAt: string;
}

interface RideContextType {
  activeRide: ActiveRide | null;
  setActiveRide: (ride: ActiveRide | null) => void;
  updateStatus: (status: RideStatus) => void;
  pendingPickup: Location | null;
  setPendingPickup: (loc: Location | null) => void;
