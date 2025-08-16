# Blog App Folder Structure

## Root Directory
```
BlogPostorNotes Management App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── config.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── blog.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── comment.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── blog.js
│   │   │   ├── comment.js
│   │   │   └── category.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── blogs.js
│   │   │   ├── users.js
│   │   │   └── comments.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── blog.service.js
│   │   │   └── email.service.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   └── app.js
│   ├── uploads/
│   │   ├── images/
│   │   └── documents/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── BlogApp/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── Layout.jsx
│   │   │   │   ├── auth/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   ├── Register.jsx
│   │   │   │   │   └── Profile.jsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── BlogList.jsx
│   │   │   │   │   ├── BlogCard.jsx
│   │   │   │   │   ├── BlogDetail.jsx
│   │   │   │   │   ├── CreateBlog.jsx
│   │   │   │   │   ├── EditBlog.jsx
│   │   │   │   │   └── BlogForm.jsx
│   │   │   │   ├── comment/
│   │   │   │   │   ├── CommentList.jsx
│   │   │   │   │   ├── CommentForm.jsx
│   │   │   │   │   └── CommentItem.jsx
│   │   │   │   └── user/
│   │   │   │       ├── UserProfile.jsx
│   │   │   │       └── UserBlogs.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useBlogs.js
│   │   │   │   └── useApi.js
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── blog.service.js
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   └── ThemeContext.jsx
│   │   │   ├── styles/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   └── global.css
│   │   │   ├── utils/
│   │   │   │   ├── constants.js
│   │   │   │   └── helpers.js
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── vite.config.js
│   │   └── README.md
│   │
│   └── TaskDescription.txt
│
├── shared/
│   ├── types/
│   │   ├── user.types.js
│   │   ├── blog.types.js
│   │   └── comment.types.js
│   └── constants/
│       └── index.js
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── README.md
└── package.json
```

## Key Features Structure

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

### Database Collections
- **users**: User information and authentication
- **blogs**: Blog posts with metadata
- **comments**: User comments on blogs
- **categories**: Blog categories and tags
- **sessions**: User sessions for auth
- **uploads**: File upload tracking

### Environment Variables
```
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BlogApp
```

### Scripts
```json
// Backend package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint src/"
  }
}

// Frontend package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src/"
  }
}
