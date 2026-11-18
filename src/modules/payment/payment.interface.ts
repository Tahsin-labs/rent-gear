
export interface CreatePaymentPayload {
    rentalId: string;
}

export interface PaymentResponse {
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    checkoutUrl?: string;
    rentalId: string;
}
