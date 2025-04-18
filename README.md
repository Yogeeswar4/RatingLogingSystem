# Rating App Assignment

## Overview

The **Rating App** is a full-stack application that allows users to rate stores. It includes user authentication, store management, rating functionalities, and an admin dashboard for managing users and stores.

**Important Note:**
Make sure to create an admin user using Postman or Thunder Client before accessing the admin dashboard.

## Features

- **User Authentication** (Signup/Login)
- **Rate Stores** and view/edit ratings
- **Filter & Sort** stores by name, address, and rating (ascending/descending)
- **Admin Dashboard** to manage users and stores
- **Store Owners** can view their store’s ratings
- **Unrated Store Suggestions** for users
- **User's Submitted Rating Indicator** (shows if the user has rated a store)
- **Editable Ratings** for users

## Technologies Used

- **Frontend:** React, TanStack Router, TanStack Query, TailwindCSS
- **Backend:** Node.js, Express.js, Sequelize, MySQL
- **Database:** MySQL

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **MySQL**

### Backend Setup

1. Clone the repository:
   ```bash
   git clone hhttps://github.com/HemanthDas/Rating-App-Assignment.git
   cd rating-app/BackEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure **.env** file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=ratingapp
   JWT_SECRET=your_jwt_secret
   ```
4. Sync database and start server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm run dev
   ```

---

## Usage Guide

### User Roles

- **Admin**: Can manage users and stores via the admin dashboard.
- **Store Owner**: Can view ratings for their stores.
- **Regular User**: Can rate stores and update their ratings.

### API Endpoints

- **Authentication:**

  - `POST /auth/signup`
  - `POST /auth/login`
  - `GET /auth/profile`

- **Stores:**

  - `GET /stores` (Retrieve all stores with filters & sorting)
  - `GET /stores/unrated` (Retrieve stores user hasn’t rated)
  - `GET /stores/:id` (Retrieve store details)
  - `POST /stores` (Create a new store)

- **Ratings:**
  - `POST /ratings` (Submit a rating)
  - `PUT /ratings/:id` (Edit rating)
  - `GET /ratings/store/:storeId` (Get store ratings)

---

## Testing the Application

1. **Run MySQL queries** to verify data:
   ```sql
   SELECT * FROM users;
   SELECT * FROM stores;
   SELECT * FROM ratings;
   ```
2. **Use Postman** to test API endpoints.
3. **Check the frontend UI** to ensure proper display, sorting, and rating indicators.

---

## Troubleshooting

- **Database Not Found?**
  - Ensure MySQL is running and credentials in `.env` are correct.
- **Tables Not Created?**
  - Drop and recreate the database:
    ```sql
    DROP DATABASE ratingapp;
    CREATE DATABASE ratingapp;
    ```
  - Restart the server to sync models.
- **Frontend Not Loading?**
  - Ensure `npm run dev` is running in the frontend folder.
  - Ensure `npm start` is running in the backend folder.
