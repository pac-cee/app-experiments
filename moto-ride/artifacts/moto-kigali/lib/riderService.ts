import { MOCK_CUSTOMER_REQUESTS, MOCK_JOB_HISTORY, CustomerRequest, JobRecord, Location } from "./mockData";

export async function getCustomerRequests(_riderId: string): Promise<CustomerRequest[]> {
  await delay(600);
  return MOCK_CUSTOMER_REQUESTS.filter((r) => r.status === "pending");
}

export async function acceptJob(params: {
  requestId: string;
  customerId: string;
  pickup: Location;
  destination: Location;
  price: number;
}): Promise<{ success: boolean; jobId: string }> {
  await delay(800);
  return { success: true, jobId: "job_" + Date.now() };
}

export async function getJobHistory(_riderId: string): Promise<JobRecord[]> {
