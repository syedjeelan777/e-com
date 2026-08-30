# SHAZIYAKART - Full-Stack B2B E-Commerce Marketplace

**SHAZIYAKART** is an industrial-grade B2B e-commerce marketplace built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **Mongoose / MongoDB**. It features JWT authentication, role-based authorization (Customer vs Admin), dynamic product catalog with technical specifications, slide-over cart & order checkout, customer account portal with live order tracking, and an admin management portal equipped with interactive business analytics (Recharts), inventory movement tracking, order status controls, catalog CRUD, and review moderation.

---

## 🚀 Quickstart Guide

Follow these steps to set up and run the application locally from a fresh clone:

### 1. Install Dependencies
Install all root, server, and client dependencies at once:
```bash
npm install
```

### 2. Environment Configuration
Copy the provided environment template file to `.env`:
```bash
cp .env.example .env
```
*(Optionally adjust `PORT`, `JWT_SECRET`, or `MONGODB_URI` in `.env` if needed. If MongoDB is not running locally, the application automatically falls back to an in-memory data store).*

### 3. Seed Database & Demo Data
Initialize the database with sample B2B products, categories, addresses, customer orders, reviews, and pre-configured accounts:
```bash
npm run seed
```

### 4. Start Development Server
Run both the Express backend API and Vite frontend dev server concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Seeded Demo Accounts

Use these pre-configured credentials to sign in and test different user roles:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@shaziyakart.local` | `Admin@12345` | Full access to Admin Portal, Analytics, Inventory Movements, Catalog CRUD, Order Management, Customer Stats & Reviews |
| **Customer** | `customer@shaziyakart.local` | `Customer@12345` | Access to B2B Catalog, Shopping Cart, Checkout, Order Tracking, Address Book, Wishlist & Profile |

---

## 📜 Available Scripts

Run these scripts from the repository root:

- `npm install`: Installs dependencies for root, client, and server workspaces.
- `npm run dev`: Concurrently starts backend API (`port 5000`) and frontend Vite dev server (`port 5173`).
- `npm run seed`: Seeds the database or in-memory store with B2B categories, products, orders, and demo accounts.
- `npm run build`: Compiles TypeScript and builds production assets for both server (`server/dist`) and client (`client/dist`).
- `npm run test`: Executes the complete test suite (Jest API tests + Vitest frontend integration tests).
- `npm run lint`: Runs TypeScript `--noEmit` type-checking across both client and server codebases.

---

## ✨ Key Features & Architecture

### 🏪 Customer Storefront & Shopping Experience
- **B2B Catalog & Technical Specs**: Search, filter by category/price/brand, sort products, and view deep technical specifications (e.g. Voltage, Breaking Capacity, Cut Levels).
- **Interactive Cart & Quick Checkout**: Slide-over cart drawer, unit quantity adjusters, stock limits enforcement, address picker, GST (18%) tax computation, and order placement.
- **Customer Portal**:
  - **Orders**: View past orders with an interactive status timeline (*Pending* ➔ *Confirmed* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*).
  - **Account & Address Book**: Manage multiple shipping addresses with default address designation.
  - **Wishlist & History**: Save favorite B2B items and track recently viewed items.

### 🛡️ Admin Management & Analytics Portal
- **Business Analytics**: Interactive Recharts analytics covering total revenue, order status breakdown, top-performing B2B products, monthly revenue trends, and category distribution.
- **Inventory History & Controls**: Stock status badges (*IN STOCK*, *LOW STOCK*, *OUT OF STOCK*), stock manual adjustment modal with audit log reasoning, and historical movement records.
- **Catalog Management**: Dynamic modal-driven CRUD operations for Products and Categories.
- **Order Processing**: Filter orders by status, inspect item breakdowns, and advance shipping status with custom admin notes.
- **Customer Metrics & Reviews**: View customer lifetime spend, total orders, company GSTIN numbers, and moderate user product reviews.

### 💡 Tech Stack & Resilience
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6, React Query, Recharts.
- **Backend**: Node.js, Express, Mongoose, TypeScript, JWT, BcryptJS, Express Validator, Rate Limiter.
- **Resilience**: Integrated automatic in-memory data store fallback so all endpoints, search filters, ordering, and seed scripts remain 100% operational even without a running MongoDB daemon.
- **Testing**: Jest, Supertest, Vitest, React Testing Library.

---

## 📂 Repository Directory Structure

```
shaziyakart-monorepo/
├── .env.example               # Environment variables template
├── package.json               # Root scripts (dev, build, seed, test, lint)
├── README.md                  # Comprehensive setup & architecture docs
├── client/                    # React 18 Vite Frontend
│   ├── src/
│   │   ├── api/               # Axios client with JWT interceptor
│   │   ├── components/        # UI components (Layout, Products, Cart, Admin, Common)
│   │   ├── context/           # Auth, Cart, Wishlist, Toast context providers
│   │   ├── pages/             # Public, Customer, Admin & Auth page views
│   │   ├── routes/            # Protected & Admin Role-guarded AppRoutes
│   │   ├── services/          # API service abstractions
│   │   └── types/             # TypeScript data interface definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── server/                    # Node.js Express Backend
    ├── src/
    │   ├── config/            # Database connection & in-memory fallback store
    │   ├── controllers/       # Auth, Product, Cart, Order, Inventory, Analytics controllers
    │   ├── middleware/        # Auth, Role Guard, Rate Limiter & Error handlers
    │   ├── models/            # Mongoose Schemas (User, Product, Order, Address, etc.)
    │   ├── routes/            # Express REST API routes
    │   ├── seed/              # Database seed script
    │   └── tests/             # Jest + Supertest integration tests
    ├── package.json
    └── tsconfig.json
```

---

## 🛡️ License

Distributed under the MIT License. Developed for SHAZIYAKART B2B Marketplace.
