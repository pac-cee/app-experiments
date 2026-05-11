import { MOCK_USER, User, UserRole, VehicleType } from "./mockData";

const OTP_CODE = "1234";

export interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RiderRegisterParams {
  userId: string;
  nationalId: string;
  homeAddress: string;
  vehicleType: VehicleType;
  plate: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export async function sendOtp(_phone: string): Promise<{ success: boolean }> {
  await delay(800);
  return { success: true };
}

export async function verifyOtp(_phone: string, code: string): Promise<{ success: boolean; message?: string }> {
  await delay(800);
  if (code === OTP_CODE) return { success: true };
  return { success: false, message: "Invalid code. Try 1234 for testing." };
}

export async function signup(params: SignupParams): Promise<{ success: boolean; user?: User; message?: string }> {
  await delay(1000);
  const user: User = {
    id: "u_" + Date.now(),
    name: params.name,
    phone: params.phone,
    email: params.email,
    role: params.role,
    status: "active",
  };
  return { success: true, user };
}

export async function riderRegister(params: RiderRegisterParams): Promise<{ success: boolean; message?: string }> {
  await delay(1200);
  return { success: true };
}

const MOCK_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "+250788000001": {
    password: "customer123",
