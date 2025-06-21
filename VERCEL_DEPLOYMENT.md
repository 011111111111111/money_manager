# 🚀 Deploy to Vercel (Frontend + Backend)

This guide will help you deploy your entire expense tracker app to Vercel - both frontend and backend!

## ✅ What You Get

- **Single URL**: Everything on one domain (e.g., `https://your-app.vercel.app`)
- **Free Hosting**: Vercel's generous free tier
- **Auto-deploy**: Push to GitHub → Auto-deploys
- **Global CDN**: Fast loading worldwide
- **SSL Certificate**: Automatic HTTPS

## 📋 Prerequisites

- GitHub account
- Vercel account (free)

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

1. **Create a GitHub repository** (if not already done)
2. **Push your code**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the deployment**:

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `expenso-together-now`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   **Environment Variables:**
   - `NODE_ENV=production`

6. **Click "Deploy"**

### Step 3: Wait for Deployment

- **Build time**: 2-3 minutes
- **Vercel will automatically**:
  - Install dependencies
  - Build your React app
  - Deploy your backend as serverless functions
  - Set up routing

### Step 4: Test Your App

1. **Visit your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Test the features**:
   - Create a shared event
   - Add expenses
   - Share the link with friends

## 🔧 How It Works

### File Structure on Vercel:
```
your-app.vercel.app/
├── / (React app - frontend)
├── /api/* (Express server - backend)
└── /shared/* (React routes)
```

### API Endpoints:
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/expenses`
- `https://your-app.vercel.app/api/shared-events`

### Shared Event URLs:
- `https://your-app.vercel.app/shared/ABC123`

## 🗄️ Database

- **SQLite database** stored in `/tmp` directory
- **Data persists** between function calls
- **Note**: Data may be cleared occasionally (serverless limitation)

### For Persistent Data (Optional):
Consider using a cloud database like:
- **Supabase** (free PostgreSQL)
- **PlanetScale** (free MySQL)
- **MongoDB Atlas** (free MongoDB)

## 🔄 Updates

### Automatic Updates:
1. **Push changes to GitHub**
2. **Vercel auto-deploys** in 1-2 minutes
3. **No manual intervention needed**

### Manual Deploy:
- Go to Vercel dashboard
- Click "Redeploy" button

## 📊 Monitoring

### Vercel Dashboard:
- **Analytics**: Page views, performance
- **Functions**: API call logs
- **Deployments**: Build history

### Health Check:
- Visit: `https://your-app.vercel.app/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **API Not Working**:
   - Check function logs in Vercel dashboard
   - Verify API routes are correct
   - Test with `/api/health` endpoint

3. **Database Issues**:
   - SQLite in `/tmp` may be cleared
   - Consider using cloud database for persistence

### Debug Commands:
```bash
# Test locally first
npm run dev

# Check build locally
npm run build

# Test API locally
cd backend && npm start
```

## 💰 Cost

### Vercel Free Tier:
- **100GB bandwidth/month**
- **100GB storage**
- **6000 function executions/day**
- **Perfect for small to medium apps**

### Paid Plans:
- **Pro**: $20/month (unlimited bandwidth)
- **Enterprise**: Custom pricing

## 🎉 Success!

Once deployed, your app will be live at:
- **Main URL**: `https://your-app.vercel.app`
- **Shared Events**: `https://your-app.vercel.app/shared/ABC123`

### Example URLs:
- **Home**: `https://expenso-tracker.vercel.app`
- **Shared Event**: `https://expenso-tracker.vercel.app/shared/ABC123`

## 🌐 Custom Domain (Optional)

1. **Go to Vercel project settings**
2. **Click "Domains"**
3. **Add your domain** (e.g., `expenso.yourdomain.com`)
4. **Configure DNS** as instructed

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Create an issue in your repository

---

**🎯 Your expense tracker is now live on the web! Share the link with friends and start tracking expenses together!** 