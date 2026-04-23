# TITAN Gym Management System

A comprehensive, full-stack management solution designed for gym owners to handle memberships, tracking, and administrative tasks efficiently.

## Technical Stack

### Backend
- Node.js and Express.js framework
- MongoDB database with Mongoose ODM
- JWT (JSON Web Tokens) for secure authentication
- Nodemailer for automated email communication
- Cookie-parser for secure session management
- CORS enabled for cross-origin resource sharing

### Frontend
- React.js with Create React App
- Tailwind CSS for responsive and modern UI
- Material UI (MUI) for professional iconography
- Axios for API communication
- React Router DOM for structured navigation
- React Toastify for real-time user feedback

## Core Features

- **Command Centre Dashboard**: Visual overview of total members, monthly joins, and expiring memberships.
- **Member Management**: Track member status, handle registrations, and monitor expiration dates.
- **Membership Plans**: Create and manage different types of membership tiers.
- **Gym Profile Control**: Update gym details and branding directly from the interface.
- **Automated Communication**: Integrated email notifications for member engagement.

## Project Structure

```text
.
├── backend/            # Express.js server and API logic
│   ├── Controllers/    # Business logic for routes
│   ├── Modals/         # Mongoose schemas (Models)
│   ├── Routes/         # API endpoint definitions
│   └── DBConn/         # Database connection configuration
└── frontend/           # React.js client application
    ├── src/
    │   ├── Components/ # Reusable UI components
    │   └── Pages/      # Main application views
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

### Backend Configuration
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_uri
   JWT_SecretKey=your_secret_key
   SENDER_EMAIL=your_email
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=your_frontend_url
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:4000
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Deployment

The system is configured for production deployment using environment variables.

### Recommended Hosting
- **Backend**: Render, Railway, or Heroku
- **Frontend**: Vercel, Netlify, or AWS Amplify

Ensure that the `FRONTEND_URL` in the backend and `REACT_APP_API_URL` in the frontend are updated to reflect the production URLs after deployment.

## License
This project is licensed under the ISC License.
