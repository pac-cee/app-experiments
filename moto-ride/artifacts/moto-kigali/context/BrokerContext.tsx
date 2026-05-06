import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Rider, Location, VehicleType } from "@/lib/mockData";

export interface BrokerRequest {
  id: string;
  rider: Rider;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerRating: number;
  customerRides: number;
  pickup: Location;
  destination: Location;
  vehicleType: VehicleType;
  sentAt: string;
  status: "sending" | "pending" | "viewed" | "accepted" | "declined" | "timeout" | "cancelled";
}

interface BrokerContextType {
