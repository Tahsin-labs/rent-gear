# Backend API Map

Generated from backend routes, controllers, validations, and Prisma models.

## Authentication & Authorization
- **Token Mechanism**: Bearer token in `Authorization: Bearer <token>` or HTTP-only cookie `accessToken`.
- **JWT Secret**: Set via `JWT_SECRET` / `JWT_ACCESS_SECRET`.
- **User Roles**: `CUSTOMER`, `PROVIDER`, `ADMIN`.
- **Active Statuses**: `ACTIVE`, `BLOCKED`.
- **Standard Response Shape**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "...",
    "data": {}
  }
  ```
- **Error Response Shape**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "...",
    "errorDetails": null
  }
  ```

---

## Enums
- **Role**: `CUSTOMER` | `PROVIDER` | `ADMIN`
- **ActiveStatus**: `ACTIVE` | `BLOCKED`
- **RentalStatus**: `PENDING` | `CONFIRMED` | `ACTIVE` | `COMPLETED` | `CANCELLED`
- **PaymentStatus**: `PENDING` | `COMPLETED` | `FAILED`
- **PaymentProvider**: `SSLCOMMERZ`

---

## Endpoints

### 1. Auth & Users (`/api/auth`, `/api/users`)
- `POST /api/users/register`
  - Auth: None
  - Body: `{ name: string, email: string, password: string, role?: "CUSTOMER" | "PROVIDER", profile?: { bio?: string, phone?: string } }`
  - Response: `{ success: true, statusCode: 201, message: "User registered successfully", data: User }`
- `POST /api/auth/login`
  - Auth: None
  - Body: `{ email: string, password: string }`
  - Response: `{ success: true, statusCode: 200, message: "User logged in successfully", data: { accessToken: string, user: User } }`
- `GET /api/auth/me`
  - Auth: Any authenticated user
  - Response: `{ success: true, statusCode: 200, message: "User profile fetched successfully", data: { id, email, role } }`

### 2. Categories (`/api/admin/categories`)
- `GET /api/admin/categories`
  - Auth: None (public read)
  - Response: `{ success: true, statusCode: 200, message: "Categories retrieved successfully", data: Category[] }`
- `POST /api/admin/categories`
  - Auth: ADMIN
  - Body: `{ name: string, description?: string }`
  - Response: `{ success: true, statusCode: 201, message: "Category created successfully", data: Category }`

### 3. Gear Catalog & Management (`/api/provider/gear`)
- `GET /api/provider/gear`
  - Auth: None (public browse)
  - Query params: `search`, `categoryId`, `brand`, `minPrice`, `maxPrice`, `page`, `limit`
  - Response: `{ success: true, message: "Gear retrieved successfully", data: GearItem[], meta: { page, limit, total, totalPages } }`
- `GET /api/provider/gear/:id`
  - Auth: None (public view)
  - Response: `{ success: true, message: "Gear retrieved successfully", data: GearItem & { category, provider, reviews } }`
- `POST /api/provider/gear`
  - Auth: PROVIDER
  - Body: `{ name: string, description: string, brand: string, imageUrl: string, pricePerDay: number, stock: number, categoryId: string, specifications?: any }`
  - Response: `{ success: true, message: "Gear created successfully", data: GearItem }`
- `PATCH /api/provider/gear/:id`
  - Auth: PROVIDER (owner)
  - Body: Partial update payload
  - Response: `{ success: true, message: "Gear updated successfully", data: GearItem }`
- `DELETE /api/provider/gear/:id`
  - Auth: PROVIDER (owner)
  - Response: `{ success: true, message: "Gear deleted successfully" }`

### 4. Rentals (`/api/customer/rentals`, `/api/provider/rentals`)
- `POST /api/customer/rentals`
  - Auth: CUSTOMER
  - Body: `{ gearId: string, startDate: string (ISO/date), endDate: string (ISO/date) }`
  - Response: `{ success: true, message: "Rental booking created successfully", data: Rental }`
- `GET /api/customer/rentals`
  - Auth: CUSTOMER
  - Response: `{ success: true, message: "Customer rentals retrieved successfully", data: Rental[] }`
- `GET /api/customer/rentals/:id`
  - Auth: CUSTOMER
  - Response: `{ success: true, message: "Rental retrieved successfully", data: Rental }`
- `GET /api/provider/rentals`
  - Auth: PROVIDER
  - Response: `{ success: true, message: "Provider rentals retrieved successfully", data: Rental[] }`
- `PATCH /api/provider/rentals/:id/status`
  - Auth: PROVIDER
  - Body: `{ status: RentalStatus }`
  - Response: `{ success: true, message: "Rental status updated successfully", data: Rental }`

### 5. Payments (`/api/customer/payments`)
- `POST /api/customer/payments`
  - Auth: CUSTOMER
  - Body: `{ rentalId: string }`
  - Response: `{ success: true, message: "Checkout session created", data: { payment: Payment, gatewayUrl: string } }`
- `GET /api/customer/payments`
  - Auth: CUSTOMER
  - Response: `{ success: true, data: Payment[] }`
- `GET /api/customer/payments/:id`
  - Auth: CUSTOMER
  - Response: `{ success: true, data: Payment }`
- Callback URLs:
  - `POST /api/customer/payments/success` -> redirects to `${FRONTEND_URL}/payment/success`
  - `POST /api/customer/payments/fail` -> redirects to `${FRONTEND_URL}/payment/failed`
  - `POST /api/customer/payments/cancel` -> redirects to `${FRONTEND_URL}/payment/cancelled`
  - `POST /api/customer/payments/ipn`

### 6. Reviews (`/api/customer/reviews`, `/api/gear/:gearId/reviews`)
- `POST /api/customer/reviews`
  - Auth: CUSTOMER
  - Body: `{ rentalId: string, rating: number (1-5), comment: string }`
  - Response: `{ success: true, message: "Review created successfully", data: Review }`
- `GET /api/gear/:gearId/reviews` (or `/api/customer/reviews/gear/:gearId`)
  - Auth: Public
  - Response: `{ success: true, data: Review[] }`

### 7. Admin (`/api/admin`)
- `GET /api/admin/users`
  - Auth: ADMIN
  - Response: `{ success: true, data: User[] }`
- `PATCH /api/admin/users/:id`
  - Auth: ADMIN
  - Body: `{ status: "ACTIVE" | "BLOCKED" }`
  - Response: `{ success: true, data: User }`
- `GET /api/admin/gear`
  - Auth: ADMIN
  - Response: `{ success: true, data: GearItem[] }`
- `GET /api/admin/rentals`
  - Auth: ADMIN
  - Response: `{ success: true, data: Rental[] }`
