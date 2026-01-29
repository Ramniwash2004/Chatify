# Highlights:
- Real-time Messaging via Socket.io
- Welcome Emails on Signup (Resend)
- API Rate-Limiting powered by Arcjet
- Image Uploads (Cloudinary)
- Online/Offline Presence Indicators
- Custom JWT Authentication (no 3rd-party auth)
- Zustand for State Management
- Git & GitHub Workflow (branches, PRs, merges)
-  REST API with Node.js & Express
-  MongoDB for Data Persistence
-  Beautiful UI with React, Tailwind CSS & DaisyUI
-  Notification & Typing Sounds (with toggle)
---


## Tech Stack (Planned):
- **Frontend:** React, TailwindCss
- **Backend:** Node.js (Express or pure Node.js)
- **Database:**MongoDB
- **Authentication:** JWT sessions
-**deployment** Vercel

---

# .env setup:
   ```bash
    PORT=3000
    MONGO_URI=your_mongo_uri_here

    NODE_ENV=development

    JWT_SECRET=your_jwt_secret

    RESEND_API_KEY=your_resend_api_key
    EMAIL_FROM=your_email_from_address
    EMAIL_FROM_NAME=your_email_from_name

    CLIENT_URL=http://localhost:5173

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    ARCJET_KEY=your_arcjet_key
    ARCJET_ENV=development
   ```

# Run the Backend:
   ```bash
    cd backend
    npm install
    npm start
   ```

# Run the Frontend:
   ```bash
    cd frontend
    npm install
    npm run dev
   ```
