# KC Commerce — Food Ordering App

A full-stack food ordering application: customers browse a menu, add items to a cart, check out, and track their orders; admins manage categories, products, and order fulfillment. Built as a technical challenge with a Laravel REST API backend and a React single-page frontend.

**Stack:** PHP / Laravel 12 (API), MySQL, React 19 (Vite, JavaScript), React Router, Axios, Laravel Sanctum (token auth).

## Structure

```
/backend    Laravel REST API
/frontend   React SPA (Vite)
```

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+ and npm
- MySQL (via XAMPP or standalone) running on `127.0.0.1:3306`

## Setup

### 1. Clone

```bash
git clone <repo-url>
cd kc-commerce
```

### 2. Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database connection (MySQL/XAMPP defaults shown):

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kc_commerce
DB_USERNAME=root
DB_PASSWORD=
```

Create the `kc_commerce` database (e.g. via phpMyAdmin or `mysql -u root -e "CREATE DATABASE kc_commerce"`), then run migrations and seed:

```bash
php artisan migrate --seed
php artisan serve
```

The API is now running at `http://127.0.0.1:8000/api`.

### 3. Frontend (React SPA)

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env` only needs:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

The app is now running at `http://localhost:5173`.

## Seeded Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password` |
| Customer | `customer@example.com` | `password` |

The seeder also creates 4 categories (Pizza, Burgers, Drinks, Desserts) and 10 products distributed across them.

## API Overview

Base URL: `/api`. Auth is via Sanctum bearer tokens (`Authorization: Bearer <token>`).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/register` | Public | Register a new customer account, returns user + token |
| POST | `/login` | Public | Log in, returns user + token |
| POST | `/logout` | Authenticated | Revoke the current token |
| GET | `/user` | Authenticated | Get the current authenticated user |
| GET | `/categories` | Public | List categories |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/{id}` | Admin | Update a category |
| DELETE | `/categories/{id}` | Admin | Delete a category (422 if it has products) |
| GET | `/products` | Public | List products (`?category_id=`), inactive ones hidden unless requester is admin |
| GET | `/products/{id}` | Public | Get one product |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/{id}` | Admin | Update a product |
| DELETE | `/products/{id}` | Admin | Delete a product, or deactivate it if it has order history |
| POST | `/orders` | Authenticated | Place an order from a cart payload (`items: [{product_id, quantity}]`); price is computed server-side |
| GET | `/orders` | Authenticated | List the caller's own orders, or all orders (with `?status=`) if admin |
| GET | `/orders/{id}` | Authenticated | Get one order (owner or admin only, 403 otherwise) |
| PATCH | `/orders/{id}/status` | Admin | Update an order's status |

## Architecture Decisions

**Admin accounts are seeded, not self-registered.** `POST /register` always creates a `customer` role, regardless of what the client sends. Admin accounts are provisioned via `DatabaseSeeder`. This is deliberate: letting a public registration endpoint set its own role is a privilege-escalation bug, not a feature. For this challenge's scope, one seeded admin account satisfies "administrator login"; a production version would add an admin-gated endpoint for creating further admin/staff accounts rather than opening that up publicly.

**The cart is client-side; pricing is always server-computed.** There are no `carts`/`cart_items` tables — the cart lives in React state (persisted to `localStorage`) and is only sent to the backend as a plain `{product_id, quantity}` array at checkout. The backend looks up each product's current price from the database and computes `unit_price`/`total_price` itself; it never trusts a client-submitted price. This keeps the client simple while closing off the obvious way to manipulate order totals.

**Products are soft-disabled, not hard-deleted, once they have order history.** Deleting a product that has associated `order_items` would either orphan historical order records or require cascading deletes that silently rewrite order history. Instead, `DELETE /products/{id}` sets `is_active = false` when order history exists, and only hard-deletes when it's safe to do so. The API response tells the caller which happened, and the admin UI reflects it explicitly rather than assuming the item is gone. Categories follow a stricter rule — deleting a category with any products returns a 422 rather than deleting or reassigning anything, keeping data integrity decisions explicit rather than automatic.

**Order line items expand inline rather than routing to a detail page.** Both `GET /orders` (customer and admin) already eager-load `items.product`, so the full line-item data for every order is present in the initial list response. Adding a separate `/orders/:id` route would just re-fetch data already in hand. Clicking an order row toggles an inline expansion instead — one fewer round trip, same information, and the customer and admin order views share this pattern for consistency.

## Out of Scope

This was built as a time-boxed technical challenge. Deliberately not included:

- **Payment integration** — orders are created directly with status `pending`; there's no payment gateway, card capture, or checkout provider.
- **Email notifications** — no order confirmation, status-change, or password-reset emails.
- **Password reset / email verification** — registration and login only; no forgot-password flow.
- **Automated test suite** — only Laravel's default example test scaffolding exists (`tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php`); no feature/unit tests were written against the actual API or components. All functionality was verified manually and via one-off Playwright scripts during development, not checked into the repo as a maintained suite.
- **Pagination in the admin UI** — `GET /orders` is paginated server-side (15 per page), but the admin Orders table only renders the first page; there's no "next page" control in the UI. `GET /categories` and `GET /products` aren't paginated at all (fine at the current catalog size, would need it at scale).
- **Image uploads** — products take an `image_url` string; there's no file upload/storage handling.
- **Search** — the storefront supports category filtering only, no text search across products.
- **Admin user management UI** — admin/customer accounts exist in the database, but there's no UI to list, promote, or deactivate users.
