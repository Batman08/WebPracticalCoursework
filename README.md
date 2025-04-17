# Dance Class Booking Site

This is a full-stack web application using an MVC architecture that allows users to register, log in, and book dance classes. Admins can manage users, courses, classes, and bookings via an admin dashboard.

---

## Live version

Live version: https://bilal-asghar-webcw-c8b500fdfb60.herokuapp.com/

Username: TestUser
Password: Password123*

## Run the Site on your local machine

### Requirements
- Node.js (v18+)
- npm

### Setup Instructions

1. **Unzip the project folder**  
   Extract the contents of the provided ZIP file.

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start the server**  
   ```bash
   node index.js
   ```

4. **Visit the site**  
   Open your browser and go to:  
   `http://localhost:3000`

---

## Features Implemented

### Authentication
- User registration and login
- Organiser/admin role distinction
- Password encryption using Bcrypt

### Courses & Classes
- View all available courses and class details
- Class details include date, time, location, price
- Classes grouped under relevant courses

### Booking System
- Guests & logged in users can book available classes and cancel them
- No duplicate bookings by the same user

### Admin Panel
- Add/edit/delete courses and classes
- View class-specific booking lists
- Remove bookings from classes
- Manage users:
  - View all users
  - Change users to organisers (change roles)

---

## 🛠️ Extended application Features (Not in specification)

- **User Booking Reference**: User can view and cancel bookings without having to create an account.
- **User Account Creation**: Users can create an account and book classes to keep booking history.
- **User Booking History**: Users can view and manage a list of all their booked classes.
- **Booking Cancellation**: Users can cancel their own class bookings directly.
