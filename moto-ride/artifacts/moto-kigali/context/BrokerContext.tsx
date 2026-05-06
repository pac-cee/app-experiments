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
  requests: BrokerRequest[];
  addRequest: (params: {
    rider: Rider;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerRating: number;
    customerRides: number;
    pickup: Location;
    destination: Location;
    vehicleType: VehicleType;
  }) => string;
  cancelRequest: (id: string) => void;
  updateStatus: (id: string, status: BrokerRequest["status"]) => void;
  getRequest: (id: string) => BrokerRequest | undefined;
  incomingRequest: BrokerRequest | null;
}

const BrokerContext = createContext<BrokerContextType>(null!);
