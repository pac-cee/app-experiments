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

export function BrokerProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BrokerRequest[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(new Map());

  const updateStatus = useCallback((id: string, status: BrokerRequest["status"]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }, []);

  const addRequest = useCallback((params: Omit<BrokerRequest, "id" | "sentAt" | "status">) => {
    const id = `req_${Date.now()}`;
    const newReq: BrokerRequest = {
      ...params,
      id,
      sentAt: new Date().toISOString(),
      status: "sending",
    };
    setRequests((prev) => [newReq, ...prev]);

    const t1 = setTimeout(() => updateStatus(id, "pending"), 1200);
    const t2 = setTimeout(() => updateStatus(id, "viewed"), 3500);
    const t3 = setTimeout(() => {
      setRequests((prev) => {
        const r = prev.find((x) => x.id === id);
        if (r && (r.status === "pending" || r.status === "viewed")) {
          return prev.map((x) => (x.id === id ? { ...x, status: "accepted" } : x));
        }
        return prev;
      });
    }, 7000);
    const t4 = setTimeout(() => {
      setRequests((prev) => {
        const r = prev.find((x) => x.id === id);
        if (r && r.status === "pending") {
          return prev.map((x) => (x.id === id ? { ...x, status: "timeout" } : x));
        }
