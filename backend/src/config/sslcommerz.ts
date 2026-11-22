

// export const sslcommerzConfig = {
//   storeId: process.env.SSLCOMMERZ_STORE_ID || "",
//   storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || "",
//   isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",

//   get baseUrl() {
//     return this.isLive
//       ? "https://securepay.sslcommerz.com"
//       : "https://sandbox.sslcommerz.com";
//   },

//   successUrl: `${process.env.BACKEND_URL}/api/customer/payments/success`,
//   failUrl: `${process.env.BACKEND_URL}/api/customer/payments/fail`,
//   cancelUrl: `${process.env.BACKEND_URL}/api/customer/payments/cancel`,
//   ipnUrl: `${process.env.BACKEND_URL}/api/customer/payments/ipn`,
// };


const backendBaseUrl =
  process.env.BACKEND_URL ||
  (process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:5000");

export const sslcommerzConfig = {
  storeId: process.env.SSLCOMMERZ_STORE_ID || "",
  storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || "",
  isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",

  get baseUrl() {
    return this.isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";
  },

  successUrl: `${backendBaseUrl}/api/customer/payments/success`,
  failUrl: `${backendBaseUrl}/api/customer/payments/fail`,
  cancelUrl: `${backendBaseUrl}/api/customer/payments/cancel`,
  ipnUrl: `${backendBaseUrl}/api/customer/payments/ipn`,
};
