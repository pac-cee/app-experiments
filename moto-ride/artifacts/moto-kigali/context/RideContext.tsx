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
  pendingDestination: Location | null;
  setPendingDestination: (loc: Location | null) => void;
  pendingVehicle: VehicleType | null;
  setPendingVehicle: (v: VehicleType | null) => void;
  pendingRider: Rider | null;
  setPendingRider: (r: Rider | null) => void;
  clearPending: () => void;
}

const RideContext = createContext<RideContextType>(null!);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [pendingPickup, setPendingPickup] = useState<Location | null>(null);
  const [pendingDestination, setPendingDestination] = useState<Location | null>(null);
  const [pendingVehicle, setPendingVehicle] = useState<VehicleType | null>(null);
  const [pendingRider, setPendingRider] = useState<Rider | null>(null);

  const updateStatus = (status: RideStatus) => {
    setActiveRide((prev) => (prev ? { ...prev, status } : null));
  };

  const clearPending = () => {
    setPendingPickup(null);
    setPendingDestination(null);
    setPendingVehicle(null);
    setPendingRider(null);
  };

  return (
    <RideContext.Provider
      value={{
        activeRide, setActiveRide, updateStatus,
        pendingPickup, setPendingPickup,
        pendingDestination, setPendingDestination,
        pendingVehicle, setPendingVehicle,
        pendingRider, setPendingRider,
        clearPending,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  return useContext(RideContext);
}
