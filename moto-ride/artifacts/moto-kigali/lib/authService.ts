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
