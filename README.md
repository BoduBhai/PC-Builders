# PC Builders

A full-stack e-commerce application for building and purchasing PC components

## Tech Stack

### Frontend

-   React 19
-   Vite
-   TailwindCSS 4
-   DaisyUI
-   Zustand for state management
-   React Router v7
-   Axios for API requests
-   React Hot Toast for notifications

### Backend

-   Node.js with Express
-   MongoDB with Mongoose
-   JWT for authentication
-   Redis for token storage and caching
-   Cloudinary for image storage
-   bcryptjs for password hashing

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB
-   Redis

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/yourusername/pc-builders.git
    cd pc-builders
    ```

2. Install backend dependencies

    ```bash
    npm install
    ```

3. Install frontend dependencies

    ```bash
    cd frontend
    npm install
    ```

4. Set up environment variables (see Environment Variables section)

5. Start backend server

    ```bash
    # From the root directory
    npm run dev
    ```

6. Start frontend development server
    ```bash
    # From the frontend directory
    npm run dev
    ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

# Server

PORT=5000
NODE_ENV=development

# MongoDB

MONGO_URI=your_mongodb_connection_string

# JWT

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Redis

REDIS_URL=your_redis_url

# Cloudinary

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
