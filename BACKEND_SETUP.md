# FarmVilla Backend Setup Guide

This guide will help you set up the MongoDB backend for NGO authentication and management.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Setup Steps

### 1. Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string from the "Connect" button
4. Replace the `MONGODB_URI` in `.env` file

### 3. Environment Configuration

Update the `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/farmvilla
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/farmvilla

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Cloudinary Setup (Optional)

For image uploads, create a free account at [Cloudinary](https://cloudinary.com/):
1. Sign up for a free account
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Update the `.env` file with these values

### 5. Start the Backend Server

```bash
# Development mode with auto-restart
npm run dev

# OR production mode
npm start
```

The server will start on `http://localhost:5000`

### 6. Test the API

You can test the API endpoints using:

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register NGO
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Test NGO",
    "email": "test@ngo.com",
    "mobile": "9876543210",
    "password": "password123",
    "ngoRegistrationId": "NGO12345",
    "details": "A test NGO for agricultural development",
    "focusAreas": ["Agriculture", "Environment"]
  }'
```

#### Login NGO
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ngo.com",
    "password": "password123"
  }'
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new NGO
- `POST /login` - Login NGO
- `GET /profile` - Get NGO profile (requires authentication)
- `PUT /profile` - Update NGO profile (requires authentication)
- `POST /logout` - Logout NGO

### NGO Routes (`/api/ngo`)
- `GET /all` - Get all verified NGOs (public)
- `GET /:id` - Get single NGO details (public)
- `GET /dashboard/stats` - Get dashboard statistics (private)
- `POST /request-verification` - Request verification (private)
- `GET /meta/focus-areas` - Get available focus areas (public)

## Frontend Integration

The frontend is already configured to work with this backend. Make sure:

1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:5173`
3. CORS is configured to allow requests from the frontend

## Database Schema

### NGO Collection
```javascript
{
  organizationName: String (required),
  email: String (required, unique),
  mobile: String (required),
  password: String (required, hashed),
  ngoRegistrationId: String (required, unique),
  details: String (required),
  focusAreas: [String],
  photo: {
    url: String,
    publicId: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  socialMedia: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity for Atlas

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on port 5000

3. **CORS Errors**
   - Verify FRONTEND_URL in `.env`
   - Check if frontend is running on correct port

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (5MB max)
   - Ensure file is a valid image format

### Logs

Check server logs for detailed error information:
```bash
npm run dev
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Use MongoDB Atlas or a managed MongoDB service
4. Set up proper logging
5. Use process managers like PM2
6. Configure reverse proxy (Nginx)
7. Set up SSL certificates

## Support

If you encounter any issues:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Test API endpoints individually
