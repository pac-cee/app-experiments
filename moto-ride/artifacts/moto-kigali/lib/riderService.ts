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
  await delay(600);
  return MOCK_JOB_HISTORY;
}

export async function rateCustomer(jobId: string, rating: number, _comment?: string): Promise<{ success: boolean }> {
  await delay(500);
  console.log(`Rated customer for job ${jobId}: ${rating} stars`);
  return { success: true };
}

export function formatRequestTime(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 min ago";
  return `${diff} min ago`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
