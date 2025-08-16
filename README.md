# BlogPostorNotes Management App

This application is part of the MERN stack practical series. It allows users to create, manage, and share blog posts and notes.

## Folder Structure

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
MONGODB_URI=mongodb://localhost:27017/blogapp
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
1. Clone the repository.
2. Navigate to the backend directory and run:
   ```
   npm install
   ```
3. Navigate to the frontend directory and run:
   ```
   npm install
   ```

## Usage
- To start the backend server, run:
  ```
  npm run dev
  ```
- To start the frontend application, run:
  ```
  npm run dev
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
