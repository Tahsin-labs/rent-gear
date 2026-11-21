# Frontend API Integration Map

| Component / Page | Endpoint | Method | Notes |
| :--- | :--- | :--- | :--- |
| **Login Page** (`/login`) | `/api/auth/login` | POST | Authenticates user, returns JWT and user profile |
| **Register Page** (`/register`) | `/api/users/register` | POST | Registers customer or provider account |
| **Navbar / Session Check** | `/api/auth/me` | GET | Validates token and returns current user info |
| **Browse / Explore Gear** | `/api/provider/gear` | GET | List available gear with search, category filter, pagination |
| **Gear Details Page** | `/api/provider/gear/:id` | GET | Retrieve full gear item specifications, provider, and reviews |
| **Gear Review Form** | `/api/customer/reviews` | POST | Submits a customer review for a rented gear item |
| **Gear Reviews List** | `/api/gear/:gearId/reviews` | GET | Public list of customer ratings and feedback for gear |
| **Category List Filter** | `/api/admin/categories` | GET | Public retrieval of gear categories |
| **Customer Create Rental** | `/api/customer/rentals` | POST | Books gear for given date range |
| **Customer Rentals Dashboard** | `/api/customer/rentals` | GET | Lists all bookings made by customer |
| **Customer Rental Details** | `/api/customer/rentals/:id` | GET | Retrieves a single customer rental booking |
| **Customer Pay Now Button** | `/api/customer/payments` | POST | Creates pending payment and retrieves SSLCommerz `gatewayUrl` |
| **Customer Payment History** | `/api/customer/payments` | GET | Fetches all payment transactions by customer |
| **Provider Gear Management** | `/api/provider/gear` | POST | Lists new gear item with Cloudinary images |
| **Provider Update Gear** | `/api/provider/gear/:id` | PATCH | Updates specs, pricing, or stock of owned gear |
| **Provider Delete Gear** | `/api/provider/gear/:id` | DELETE | Removes owned gear item |
| **Provider Rental Orders** | `/api/provider/rentals` | GET | Fetches rental booking requests for provider's gear |
| **Provider Update Rental Status**| `/api/provider/rentals/:id/status` | PATCH | Transitions rental status (`CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED`) |
| **Admin Users Management** | `/api/admin/users` | GET | Lists all registered platform users |
| **Admin Block/Unblock User** | `/api/admin/users/:id` | PATCH | Toggles `ACTIVE` or `BLOCKED` status |
| **Admin Gear Management** | `/api/admin/gear` | GET | Overview of all gear listed on platform |
| **Admin Rentals Oversight** | `/api/admin/rentals` | GET | Overview of all platform rentals |
