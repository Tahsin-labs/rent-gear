export interface CreateGearPayload {
  name: string;
  description: string;
  brand: string;
  imageUrl: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
}


export interface UpdateGearPayload {
  name?: string;
  description?: string;
  brand?: string;
  imageUrl?: string;
  pricePerDay?: number;
  stock?: number;
  categoryId?: string;
}