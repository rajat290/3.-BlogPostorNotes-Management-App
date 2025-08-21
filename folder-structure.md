# Notes Management App Folder Structure

## Root Directory
```
BlogPostorNotes Management App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── note.controller.js
│   │   │   └── validate.middleware.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   ├── note.js
│   │   │   └── user.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── note.routes.js
│   │   ├── utils/
│   │   │   └── sendEmail.js
│   │   └── app.js
│   ├── .gitignore
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── NoteEditor.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AddNote.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditNote.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NoteDetail.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .git/
├── folder-structure.md
└── README.md
```

## Key Features Structure

### Backend Features
- **Authentication**: JWT-based authentication with middleware protection
- **Note Management**: Complete CRUD operations for notes
- **User Management**: User registration, login, and profile management
- **Validation**: Input validation middleware for requests
- **Error Handling**: Centralized error handling middleware
- **Email Utilities**: Email sending capabilities for notifications

### Frontend Features
- **Responsive Design**: Mobile-first responsive layout
- **Authentication**: User login and registration forms
- **Note Management**: Create, read, update, and delete notes
- **Rich Text Editor**: Note editing with rich text capabilities
- **Theme Support**: Light/dark theme switching
- **Modal Components**: Confirmation modals for actions
- **API Integration**: Axios-based API communication
- **Context Management**: React context for state management

### Database Collections
- **users**: User authentication and profile information
- **notes**: Note content, metadata, and user associations

### Environment Variables
```
# Backend (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development

# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NotesApp
```

### Scripts
```json
// Backend package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

// Frontend package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Project Overview

This is a MERN stack Notes Management Application that allows users to:
- Create and manage personal notes
- Organize notes with rich text formatting
- Securely authenticate with JWT tokens
- Switch between light and dark themes
- Access notes from any device with responsive design

The application follows modern web development practices with separate backend (Node.js/Express) and frontend (React/Vite) architectures, connected through a RESTful API.
