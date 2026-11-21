import { apiClient } from "./client";
import {
  ApiResponse,
  Category,
  GearItem,
  Payment,
  Rental,
  RentalStatus,
  User,
} from "@/types";

export interface GearQueryParams {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreateGearPayload {
  name: string;
  description: string;
  brand: string;
  imageUrl: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
  specifications?: Record<string, unknown>;
}

export interface CreateRentalPayload {
  gearId: string;
  startDate: string;
  endDate: string;
}

export interface CreateReviewPayload {
  rentalId: string;
  rating: number;
  comment: string;
}

export const api = {
  // Auth
  auth: {
    register: (payload: { name: string; email: string; password: string; role?: "CUSTOMER" | "PROVIDER"; profile?: { bio?: string; phone?: string } }) =>
      apiClient<ApiResponse<User>>("users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      apiClient<ApiResponse<{ accessToken: string; user: User }>>("auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    me: () => apiClient<ApiResponse<User>>("auth/me", { method: "GET" }),
  },

  // Categories
  categories: {
    getAll: () => apiClient<ApiResponse<Category[]>>("admin/categories", { method: "GET" }),
    create: (payload: { name: string; description?: string }) =>
      apiClient<ApiResponse<Category>>("admin/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Gear
  gear: {
    getAll: (params?: GearQueryParams) =>
      apiClient<ApiResponse<GearItem[]>>("provider/gear", {
        method: "GET",
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    getById: (id: string) => apiClient<ApiResponse<GearItem>>(`provider/gear/${id}`, { method: "GET" }),
    create: (payload: CreateGearPayload) =>
      apiClient<ApiResponse<GearItem>>("provider/gear", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: Partial<CreateGearPayload>) =>
      apiClient<ApiResponse<GearItem>>(`provider/gear/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    delete: (id: string) =>
      apiClient<ApiResponse<void>>(`provider/gear/${id}`, {
        method: "DELETE",
      }),
  },

  // Rentals
  rentals: {
    create: (payload: CreateRentalPayload) =>
      apiClient<ApiResponse<Rental>>("customer/rentals", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getMyRentals: () => apiClient<ApiResponse<Rental[]>>("customer/rentals", { method: "GET" }),
    getMyRentalById: (id: string) =>
      apiClient<ApiResponse<Rental>>(`customer/rentals/${id}`, { method: "GET" }),
    getProviderRentals: () => apiClient<ApiResponse<Rental[]>>("provider/rentals", { method: "GET" }),
    updateStatus: (id: string, status: RentalStatus) =>
      apiClient<ApiResponse<Rental>>(`provider/rentals/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  // Payments
  payments: {
    create: (rentalId: string) =>
      apiClient<ApiResponse<{ payment: Payment; gatewayUrl?: string }>>("customer/payments", {
        method: "POST",
        body: JSON.stringify({ rentalId }),
      }),
    getMyPayments: () => apiClient<ApiResponse<Payment[]>>("customer/payments", { method: "GET" }),
    getById: (id: string) => apiClient<ApiResponse<Payment>>(`customer/payments/${id}`, { method: "GET" }),
  },

  // Reviews
  reviews: {
    create: (payload: CreateReviewPayload) =>
      apiClient<ApiResponse<unknown>>("customer/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getByGearId: (gearId: string) =>
      apiClient<ApiResponse<unknown[]>>(`gear/${gearId}/reviews`, { method: "GET" }),
  },

  // Admin
  admin: {
    getUsers: () => apiClient<ApiResponse<User[]>>("admin/users", { method: "GET" }),
    updateUserStatus: (id: string, status: "ACTIVE" | "BLOCKED") =>
      apiClient<ApiResponse<User>>(`admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    getGear: () => apiClient<ApiResponse<GearItem[]>>("admin/gear", { method: "GET" }),
    getRentals: () => apiClient<ApiResponse<Rental[]>>("admin/rentals", { method: "GET" }),
  },
};
