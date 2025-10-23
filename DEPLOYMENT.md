# 🚀 Deployment Guide

This guide covers multiple deployment options for your E-commerce application.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (or local MongoDB)
- Redis Cloud account (or local Redis)
- Stripe account
- Cloudinary account

## 🔧 Environment Setup

### 1. Database Setup

**MongoDB Atlas (Recommended)**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

**Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community
mongod --config /usr/local/etc/mongod.conf
```

### 2. Redis Setup

**Redis Cloud (Recommended)**
1. Create a Redis Cloud account
2. Create a new database
3. Get your connection string
4. Update `REDIS_URL` in your environment variables

**Local Redis**
```bash
# Install Redis locally
brew install redis
redis-server
```

### 3. Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

### 4. Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Update the Cloudinary environment variables

## 🌐 Deployment Options

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel)**
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install-all`
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

**Backend (Railway)**
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `REDIS_URL`: Your Redis connection string
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your Vercel frontend URL
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `CLOUDINARY_*`: Your Cloudinary credentials

### Option 2: Netlify + Render

**Frontend (Netlify)**
1. Go to [Netlify](https://netlify.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL

**Backend (Render)**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)

### Option 3: Heroku

**Backend (Heroku)**
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Add MongoDB addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```
4. Add Redis addon:
   ```bash
   heroku addons:create heroku-redis:mini
   ```
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=https://your-frontend.vercel.app
   # ... add other variables
   ```
6. Deploy:
   ```bash
   git subtree push --prefix=backend heroku main
   ```

**Frontend (Vercel/Netlify)**
- Deploy frontend to Vercel or Netlify as described above

### Option 4: Docker Deployment

**Using Docker Compose**
1. Update `docker-compose.yml` with your environment variables
2. Run:
   ```bash
   docker-compose up -d
   ```

**Using Docker**
1. Build the image:
   ```bash
   docker build -t ecommerce-app .
   ```
2. Run the container:
   ```bash
   docker run -p 5002:5002 -e MONGODB_URI=your_mongo_uri ecommerce-app
   ```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique secrets for JWT
- Rotate API keys regularly
- Use different keys for development and production

### CORS Configuration
- Update CORS origins for production
- Use HTTPS in production
- Configure proper headers

### Database Security
- Use MongoDB Atlas with proper authentication
- Enable IP whitelisting
- Use connection strings with credentials

## 📊 Monitoring & Logging

### Health Checks
- Backend health endpoint: `/health`
- Monitor uptime and response times
- Set up alerts for failures

### Logging
- Use structured logging
- Monitor error rates
- Track performance metrics

## 🚨 Troubleshooting

### Common Issues

**CORS Errors**
- Check CORS configuration
- Verify frontend URL in backend settings
- Ensure HTTPS in production

**Database Connection Issues**
- Verify MongoDB connection string
- Check network access
- Verify credentials

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**Environment Variables**
- Verify all required variables are set
- Check variable names and values
- Restart services after changes

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Implement lazy loading

### Backend
- Use Redis for caching
- Optimize database queries
- Implement rate limiting
- Use connection pooling

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

If you encounter issues during deployment:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally with production settings
4. Check the troubleshooting section above

---

**Happy Deploying! 🚀**
