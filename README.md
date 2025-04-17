# Dance Class Booking Site

This is a full-stack mvc web application that allows users to register, log in, and book dance classes. Admins can manage users, courses, classes, and bookings via an admin dashboard.

---

## Live version

Live version: https://bilal-asghar-webcw-c8b500fdfb60.herokuapp.com/

For Markers - use these account details below:
Username: TestUser
Password: Password123*

## Run the Site on your local machine

### Requirements
- Node.js (v18+)
- npm

### Setup Instructions

1. **Unzip the project folder**  
   Extract the contents of the provided ZIP file and go into root folder.

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

### User Authentication  
- Register new accounts and log in securely  
- Admin and organiser roles with separate permissions  
- Passwords protected using Bcrypt hashing  

### Courses and Classes  
- Browse all courses and view associated class info  
- Class information includes time, date, price, and location  
- Classes organized under their parent course for easy access  

### Booking System
- Guests & logged in users can book available classes and cancel them
- Guest users will be given a booking reference after booking a class to allow for cancellation
- No duplicate bookings by the same user

### Admin Panel
- Add/edit/delete courses and classes
- View class participant bookings
- Remove bookings from classes
- Manage users:
  - View all users
  - Change users to organisers (change roles)

---

## Extended application Features (Not in specification)

- **User Booking Reference**: User can view and cancel bookings without having to create an account.
- **User Account Creation**: Users can create an account and book classes to keep booking history.
- **User Booking History**: Users can view and manage a list of all their booked classes.
- **Booking Cancellation**: Users can cancel their own class bookings directly.

---

## Code Enhancements for Maintainability and User Experience

### Use of Client-Side JavaScript

Although the project was originally intended to use only Node.js and Mustache for rendering, limited client-side JavaScript was introduced to improve user experience. For example, when editing class details, data is loaded into a modal dynamically without requiring a full page reload. This allows users to make changes inline, resulting in a smoother and more efficient interaction without constant navigation between pages.

### Bundles.json for Resource Management

To simplify and centralize the inclusion of CSS and JavaScript assets, a `bundles.json` file was implemented. This file defines which scripts and styles should be loaded for each specific page. By doing this, it becomes easier to manage resource paths and dependencies in one place, rather than updating multiple template files whenever changes are needed. This improves maintainability and scalability as the project grows.
Let me know if you want this section adapted.