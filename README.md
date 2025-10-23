# 🛒 E-Commerce Full-Stack Application

A modern, full-stack e-commerce application built with React, Node.js, MongoDB, and Stripe payment integration.

## ✨ Features

- **Frontend**: React with Vite, Tailwind CSS, Zustand state management
- **Backend**: Node.js/Express with MongoDB, Redis caching
- **Authentication**: JWT-based user authentication
- **Payments**: Stripe integration for secure payments
- **Admin Dashboard**: Analytics, product management, order tracking
- **Image Upload**: Cloudinary integration
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Stripe account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashish001123/Ecommerse.git
   cd Ecommerse
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp environment.example backend/.env
   
   # Edit backend/.env with your actual values
   nano backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:5002

## 🔧 Environment Variables

Create a `backend/.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5002
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis
REDIS_URL=redis://localhost:6379
```

## 🚀 Deployment

### Option 1: Vercel + Railway

**Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL

**Backend (Railway)**
1. Connect your GitHub repository to Railway
2. Set root directory: `backend`
3. Add environment variables from your `.env` file

### Option 2: Netlify + Render

**Frontend (Netlify)**
1. Connect repository to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`

**Backend (Render)**
1. Create new Web Service
2. Connect repository
3. Root directory: `backend`
4. Add environment variables

### Option 3: Heroku

1. Install Heroku CLI
2. Create Heroku apps:
   ```bash
   # Backend
   heroku create your-app-backend
   
   # Frontend
   heroku create your-app-frontend
   ```

3. Deploy:
   ```bash
   # Backend
   git subtree push --prefix=backend heroku main
   
   # Frontend
   git subtree push --prefix=frontend heroku main
   ```

## 📁 Project Structure

```
E-Commerse/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   └── config/         # API configuration
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── config/             # Database & service configs
│   ├── controller/         # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   └── routes/             # API routes
└── README.md
```

## 🛠️ Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run server` - Start only backend server
- `npm run client` - Start only frontend development server
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run install-all` - Install all dependencies

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Input validation and sanitization

## 📊 Admin Features

- User management
- Product CRUD operations
- Order tracking
- Sales analytics dashboard
- Coupon management

## 🎨 UI/UX Features

- Responsive design
- Dark theme
- Smooth animations with Framer Motion
- Loading states
- Error handling
- Toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues, please create an issue in the GitHub repository.

---

**Happy Coding! 🚀**