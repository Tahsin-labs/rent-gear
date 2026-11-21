
export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
  profile?: {
    bio?: string;
    phone?: string;
  };
}
