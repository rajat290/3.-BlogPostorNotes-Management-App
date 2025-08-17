# BlogPostorNotes Management App

This application is part of the MERN stack practical series. It allows users to create, manage, and share blog posts and notes.

## Quick Fix for MongoDB Connection Error

If you're seeing the error: **"Could not connect to any servers in your MongoDB Atlas cluster"**, follow these steps:

### Immediate Solutions:

1. **Check your .env file** in the backend folder:
   ```bash
   cd backend
   # Create .env file if it doesn't exist
   echo "PORT=5000" > .env
   echo "MONGO_URI=mongodb://localhost:27017/blogapp" >> .env
   echo "JWT_SECRET=your-secret-key" >> .env
   ```

2. **For Local MongoDB** (easiest fix):
   - Install MongoDB locally
   - Use: `mongodb://localhost:27017/blogapp`

3. **For MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster → Database Access → Add user
   - Network Access → Add IP (use 0.0.0.0/0 for development)
   - Get connection string

### Folder Structure

```
BlogPostorNotes Management App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── BlogApp/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── shared/
│   ├── types/
│   └── constants/
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
│
├── .gitignore
└── README.md
```

## Key Features

### Backend Features
- **Authentication**: JWT-based auth with refresh tokens
- **Blog Management**: CRUD operations for blogs
- **User Management**: Profile management and user roles
- **Comment System**: Nested comments with moderation
- **File Upload**: Image uploads for blog posts
- **Search & Filter**: Full-text search and category filtering
- **Pagination**: Efficient data loading
- **Rate Limiting**: API protection

### Frontend Features
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching
- **Rich Text Editor**: WYSIWYG editor for blog posts
- **Image Gallery**: Multiple image uploads
- **Real-time Updates**: Live comments and notifications
- **SEO Optimization**: Meta tags and structured data
- **Progressive Web App**: Offline capabilities
- **Accessibility**: WCAG 2.1 compliance

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BlogApp
```

## Installation Instructions

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file with your MongoDB URI
   echo "PORT=5000" > .env
   echo "MONGO_URI=mongodb://localhost:27017/blogapp" >> .env
   echo "JWT_SECRET=your-secret-key" >> .env
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend/BlogApp
   npm install
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

## Database Setup

### Option 1: Local MongoDB (Recommended for development)
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/blogapp`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

## Troubleshooting MongoDB Connection

### Common Error: "Could not connect to any servers"
This error occurs when MongoDB Atlas cannot be reached. Solutions:

1. **Check your .env file**:
   ```bash
   # Make sure MONGO_URI is set correctly
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp
   ```

2. **Whitelist IP in MongoDB Atlas**:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add your current IP or use "Allow Access from Anywhere" (0.0.0.0/0) for development

3. **Verify database user credentials**:
   - Ensure the username and password in your connection string are correct
   - Check the database user has proper permissions

4. **Check MongoDB cluster status**:
   - Ensure your cluster is running in MongoDB Atlas
   - Verify the cluster name in your connection string

## Usage

### Start Backend
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### Start Frontend
```bash
cd frontend/BlogApp
npm run dev
# App will run on http://localhost:5173
```

## Scripts

### Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Quick Start Commands

```bash
# Backend setup
cd backend
npm install
