import React, { createContext, useContext, useState } from "react";
import { CustomerRequest, Location, JobStatus } from "@/lib/mockData";

export interface ActiveJob {
  jobId: string;
  customer: CustomerRequest["customer"];
  pickup: Location;
  destination: Location;
  price: number;
  status: JobStatus;
  acceptedAt: string;
}

interface RiderContextType {
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
  activeJob: ActiveJob | null;
  setActiveJob: (j: ActiveJob | null) => void;
  updateJobStatus: (s: JobStatus) => void;
  pendingCustomer: CustomerRequest | null;
  setPendingCustomer: (c: CustomerRequest | null) => void;
}

const RiderContext = createContext<RiderContextType>(null!);

export function RiderProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [pendingCustomer, setPendingCustomer] = useState<CustomerRequest | null>(null);

  const updateJobStatus = (s: JobStatus) => {
    setActiveJob((prev) => (prev ? { ...prev, status: s } : null));
  };

  return (
    <RiderContext.Provider
      value={{
        isOnline, setIsOnline,
        activeJob, setActiveJob, updateJobStatus,
        pendingCustomer, setPendingCustomer,
      }}
    >
      {children}
    </RiderContext.Provider>
  );
}

export function useRider() {
  return useContext(RiderContext);
}
