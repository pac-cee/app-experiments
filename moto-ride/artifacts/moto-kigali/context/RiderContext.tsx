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
