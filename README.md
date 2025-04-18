# Rating Loging System Assignment

# Overview

The Rating App is a full-stack Development that enables users to rate stores. It features user authentication, store management, rating functionalities, and an admin dashboard for managing both users and stores.

Note: Ensure that you create an admin user using Postman before accessing the admin dashboard.

# Features

# User Authentication (Login/Signup)
Rate Stores and view/edit ratings
Filter & Sort stores by name, address, and rating (ascending/descending)
Admin Dashboard to manage users and stores
Store Owners can view their store’s ratings


# Technologies Used

Frontend:React, TanStack , TailwindCSS
Backend: Node.js, Express.js, Sequelize, MySQL
Database: MySQL

---


# Backend Setup

1. Clone the repository:

   git clone https://github.com/Yogeeswar4/RatingLogingSystem.git
   cd rating-app/BackEnd
  
2. Install dependencies:

   npm install

3. Configure **.env** file:
 
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=ratingapp
   JWT_SECRET=your_jwt_secret
  
4. Start server:
   
   npm start
  

### Frontend Setup

1. Navigate to the frontend directory:
   
   cd ../FrontEnd
   
2. Install dependencies:
   
   npm install
   
3. Start the frontend application:
   
   npm run dev
   

---

 ### User Roles :

Admin: Can manage users and stores via the admin dashboard.
Store Owner: Can view ratings for their stores.
User: Can rate stores and update their ratings.

### API Endpoints

- Authentication:

  - `POST /auth/signup`
  - `POST /auth/login`
  - `GET /auth/profile`


---

## Testing the Application


1. **Use Postman** to test API endpoints.

