import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, CreateGearPayload, CreateRentalPayload, GearQueryParams } from "@/lib/api/endpoints";
import { RentalStatus } from "@/types";
import { toast } from "sonner";

// Gear Hooks
export function useGear(params?: GearQueryParams) {
  return useQuery({
    queryKey: ["gear", params],
    queryFn: () => api.gear.getAll(params),
  });
}

export function useGearById(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => api.gear.getById(id),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.categories.getAll(),
  });
}

// Customer Rentals
export function useRentals() {
  return useQuery({
    queryKey: ["rentals", "customer"],
    queryFn: () => api.rentals.getMyRentals(),
  });
}

export function useRentalById(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: () => api.rentals.getMyRentalById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalPayload) => api.rentals.create(payload),
    onSuccess: () => {
      toast.success("Rental request created successfully");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to create rental");
    },
  });
}

// Payments
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => api.payments.getMyPayments(),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rentalId: string) => api.payments.create(rentalId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      if (res.data?.gatewayUrl) {
        window.location.href = res.data.gatewayUrl;
      }
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to initiate payment");
    },
  });
}

// Provider Gear Hooks
export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGearPayload) => api.gear.create(payload),
    onSuccess: () => {
      toast.success("Gear listed successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to list gear");
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateGearPayload> }) =>
      api.gear.update(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Gear updated successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear", variables.id] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to update gear");
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.gear.delete(id),
    onSuccess: () => {
      toast.success("Gear removed successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to delete gear");
    },
  });
}

// Provider Orders / Rentals
export function useProviderOrders() {
  return useQuery({
    queryKey: ["rentals", "provider"],
    queryFn: () => api.rentals.getProviderRentals(),
  });
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      api.rentals.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Rental status updated");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to update status");
    },
  });
}

// Admin Hooks
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.admin.getUsers(),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      api.admin.updateUserStatus(id, status),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to update user status");
    },
  });
}
