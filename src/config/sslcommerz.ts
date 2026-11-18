

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


export const sslcommerzConfig = {
  storeId: process.env.SSLCOMMERZ_STORE_ID || "",
  storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || "",
  isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",

  get baseUrl() {
    return this.isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";
  },

  successUrl: `${process.env.BACKEND_URL}/api/customer/payments/success`,
  failUrl: `${process.env.BACKEND_URL}/api/customer/payments/fail`,
  cancelUrl: `${process.env.BACKEND_URL}/api/customer/payments/cancel`,
  ipnUrl: `${process.env.BACKEND_URL}/api/customer/payments/ipn`,
};
