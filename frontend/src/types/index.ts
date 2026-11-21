export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BLOCKED";
export type RentalStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentProvider = "SSLCOMMERZ";

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Profile {
  id: string;
  bio?: string | null;
  phone?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
  profile?: Profile | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  gearId: string;
  customerId: string;
  rentalId?: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  imageUrl: string;
  pricePerDay: number | string;
  stock: number;
  isAvailable: boolean;
  specifications?: Record<string, unknown> | null;
  categoryId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    email: string;
  };
  reviews?: Review[];
}

export interface Rental {
  id: string;
  customerId: string;
  gearId: string;
  startDate: string;
  endDate: string;
  totalPrice: number | string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  gear?: {
    id: string;
    name: string;
    imageUrl: string;
    pricePerDay: number | string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  payment?: Payment | null;
  review?: Review | null;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number | string;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
  rental?: Rental;
}
