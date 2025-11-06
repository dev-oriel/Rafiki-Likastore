
# Rafiki Likastore - MERN E-Commerce Platform

Welcome to Rafiki Likastore! This is a complete MERN stack (MongoDB, Express, React, Node.js) web application designed as a developer-first project for an online liquor store. It's built to be run entirely on `localhost` with minimal setup, making it perfect for learning, prototyping, or building upon.

The application features a modern, minimalist UI styled with Tailwind CSS, a complete shopping cart and checkout flow, and a fully integrated M-Pesa Daraja STK Push payment system for a seamless user experience.

## ✨ Features

- **Full E-Commerce Flow**: Browse products, add to cart, checkout, and view order history.
- **User Authentication**: Secure JWT-based authentication for signup, login, and protected routes.
- **M-Pesa Payment Integration**: Working Daraja API sandbox integration for STK Push payments.
- **Developer-Focused**:
  - Easy local setup with `npm` scripts.
  - Database seeding for instant sample data.
  - Mock M-Pesa callback for testing without the Safaricom sandbox.
  - Clear, commented code and extensive console logging for tracing.
- **Admin Dashboard**: Basic interface for product management (Create, Read, Update, Delete).
- **Age Verification**: A splash screen to ensure users meet the legal age requirement.
- **Responsive Design**: Modern UI that works on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Payments**: Axios for M-Pesa Daraja API integration

## 📂 Project Structure

The project is a monorepo with two main folders: `backend` and `frontend`.

```
rafiki-likastore/
├── backend/      # Express.js REST API
├── frontend/     # React.js Client
├── .env.example  # Environment variable template
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rafiki-likastore.git
cd rafiki-likastore
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the `backend` directory by copying the example file.

```bash
cd backend
cp ../.env.example .env
```

Now, open `backend/.env` and fill in the required values:
- `MONGO_URI`: Should be `mongodb://localhost:27017/rafiki` if your MongoDB is running on the default port.
- `JWT_SECRET`: A random, secure string.
- `MPESA_*`: Your sandbox credentials from the [Safaricom Developer Portal](https://developer.safaricom.co.ke/). **Leave them blank if you only plan to use the mock payment flow.**

### 3. Setup the Backend

```bash
cd backend
npm install
```

### 4. Seed the Database

To populate your local MongoDB instance with sample users, an admin account, and ~30 liquor products, run the seed script. **Make sure your MongoDB server is running first.**

```bash
npm run seed
```

This will create:
- **Admin User**: `admin@rafiki.com` / `password123`
- **Regular User**: `user@rafiki.com` / `password123`
- Products, categories, and other necessary data.

### 5. Start the Backend Server

```bash
npm run dev
```

The backend API will be running on `http://localhost:5000`.

### 6. Setup the Frontend

Open a new terminal window.

```bash
cd frontend
npm install
```

### 7. Start the Frontend Development Server

```bash
npm run dev
```

The React application will be running on `http://localhost:5173`.

---

## 💳 Testing M-Pesa Payments

You have two ways to test the payment flow.

### A. Mock Payment Flow (Recommended for UI/UX testing)

This flow simulates a successful M-Pesa payment without needing credentials or an internet connection to the Daraja API.

1. Proceed to the checkout page.
2. Enter any valid phone number format (e.g., 254712345678).
3. After confirming the order, the system will use the mock callback to automatically approve the payment after a short delay.
4. You will be redirected to the order confirmation page.

### B. Live Sandbox Flow (For testing actual Daraja integration)

1. Ensure you have filled in your sandbox `MPESA_*` credentials in the `backend/.env` file.
2. Ensure the `MPESA_CALLBACK_URL` is accessible. If running locally, you might need a tool like [ngrok](https://ngrok.com/) to expose `http://localhost:5000` to the internet. Update the `.env` file with the ngrok URL.
3. Proceed to checkout and enter a phone number registered on the Safaricom sandbox.
4. You will receive an STK push on your phone. Enter your PIN to complete the transaction.
5. The backend will wait for the callback from Safaricom to update the order status.

---

## 📜 API Endpoints

The backend provides the following REST API endpoints under the `/api` prefix.

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart/item/:productId`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/payments/mpesa/stk-push`
- `POST /api/payments/mpesa/callback` (for Daraja)
- `POST /api/payments/mpesa/mock-callback` (for local dev)

Admin-only endpoints require a valid admin JWT.

---

## Troubleshooting

- **MongoDB Connection Error**: Ensure the MongoDB daemon (`mongod`) is running. Check your `MONGO_URI` in `backend/.env`.
- **CORS Errors**: The `FRONTEND_URL` in `backend/.env` must match the URL of the running frontend application (`http://localhost:5173`).

## 🚀 Future Deployment Checklist

This project is designed for local development. To deploy it to production, you would need to:
1.  **Switch to Production Keys**: Update `.env` files with production database credentials, JWT secrets, and M-Pesa live credentials.
2.  **Build Frontend**: Run `npm run build` in the `frontend` directory.
3.  **Serve Static Files**: Configure the Express server to serve the static files from `frontend/dist`.
4.  **Security**: Implement rate limiting, more robust validation, and other security best practices.
5.  **Hosting**: Deploy the Node.js application to a service like Heroku, Vercel, or a VPS.
6.  **Database**: Use a managed database service like MongoDB Atlas.

