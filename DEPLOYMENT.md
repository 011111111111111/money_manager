# 🚀 Deployment Guide

This guide will help you deploy your expense tracker app to the web so anyone can access it!

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free tier available)

## 🎯 Deployment Options

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Vercel (React app)
- **Backend**: Railway (Node.js API)
- **Database**: Railway (PostgreSQL)

### Option 2: All on Railway
- **Everything**: Frontend, Backend, Database on Railway

### Option 3: Render
- **Free tier**: Good for small projects

---

## 🚀 Option 1: Vercel + Railway Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Configure the deployment**:
   - **Root Directory**: `expenso-together-now/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=3001`

### Step 3: Get Your Backend URL

1. **Wait for deployment** (usually 2-3 minutes)
2. **Copy the generated URL** (e.g., `https://your-app.railway.app`)
3. **Test the API**: Visit `https://your-app.railway.app/api/health`

### Step 4: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your repository
4. **Configure the deployment**:
   - **Framework Preset**: Vite
   - **Root Directory**: `expenso-together-now`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.railway.app/api`
6. **Deploy**

### Step 5: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Create a shared event**
3. **Test the sharing functionality**

---

## 🚀 Option 2: All on Railway

### Step 1: Deploy Backend

1. **Follow Step 2 from Option 1** to deploy backend
2. **Note your backend URL**

### Step 2: Deploy Frontend

1. **Create another Railway project**
2. **Select your repository**
3. **Configure**:
   - **Root Directory**: `expenso-together-now`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview`
4. **Add Environment Variable**:
   - `VITE_API_URL=https://your-backend.railway.app/api`

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend
```env
NODE_ENV=production
PORT=3001
```

---

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain
1. **Go to your Vercel project**
2. **Settings** → **Domains**
3. **Add your domain** (e.g., `expenso.yourdomain.com`)
4. **Configure DNS** as instructed

### Railway Custom Domain
1. **Go to your Railway project**
2. **Settings** → **Domains**
3. **Add custom domain**

---

## 📊 Database Migration (Optional)

If you want to use PostgreSQL instead of SQLite:

1. **Add PostgreSQL to Railway project**
2. **Update backend code** to use PostgreSQL
3. **Migrate data** from SQLite to PostgreSQL

---

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure backend CORS is configured for your frontend domain
   - Update `cors` configuration in `server.js`

2. **API Not Found**:
   - Check environment variables
   - Verify backend URL is correct
   - Test API endpoints directly

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for errors

### Debug Commands:

```bash
# Test backend locally
cd backend
npm start

# Test frontend locally
npm run dev

# Check environment variables
echo $VITE_API_URL
```

---

## 🎉 Success!

Once deployed, your app will be accessible at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

### Example URLs:
- **Home**: `https://expenso-app.vercel.app`
- **Shared Event**: `https://expenso-app.vercel.app/shared/ABC123`

---

## 💰 Cost Estimation

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month (usually enough for small apps)
- **Total**: ~$0-5/month for small to medium usage

### Paid Plans:
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Railway**: Pay-as-you-use

---

## 🔄 Updates & Maintenance

### Deploying Updates:
1. **Push changes to GitHub**
2. **Vercel/Railway will auto-deploy**
3. **No manual intervention needed**

### Monitoring:
- **Vercel Analytics**: Built-in performance monitoring
- **Railway Logs**: Real-time application logs
- **Health Checks**: Monitor API endpoints

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **GitHub Issues**: Create an issue in your repository

---

**🎯 Your app is now live on the web! Share the link with friends and start tracking expenses together!** 