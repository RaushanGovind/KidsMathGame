# Kids Math Game Backend - Deployment Guide

## 🚀 Deploy Backend to Render

Your backend needs to be deployed online so your live Vercel app can access it.

### Step 1: Prepare for Deployment

1. The backend is ready with all necessary files:
   - ✅ `main.py` - FastAPI application
   - ✅ `requirements.txt` - Python dependencies
   - ✅ `Procfile` - Deployment configuration

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up for a free account (you can use GitHub)

### Step 3: Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `RaushanGovind/KidsMathGame`
3. Configure:
   - **Name**: `kids-math-game-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

4. Click **"Advanced"** and add Environment Variable:
   - **Key**: `MONGO_DETAILS`
   - **Value**: `mongodb+srv://KidsGame:Raushan236@cluster0.rwxvzfk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

5. Click **"Create Web Service"**

### Step 4: Get your Backend URL

After deployment (takes 2-3 minutes), you'll get a URL like:
```
https://kids-math-game-api.onrender.com
```

### Step 5: Configure Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://kids-math-game-api.onrender.com` (your Render URL)
   - **Environment**: Check all (Production, Preview, Development)

4. Redeploy your frontend

### Step 6: Test

Visit your live site and test the GK game! 🎉

---

## 📝 Notes

- **Free Tier**: Render free tier may "sleep" after 15 minutes of inactivity (first request takes ~30 seconds to wake up)
- **Upgrade Option**: For $7/month, your backend stays awake 24/7
- **Database**: Already using MongoDB Atlas (always online)

---

## 🔧 Alternative: Deploy to Railway

If you prefer Railway instead of Render:

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select `backend` folder
4. Add `MONGO_DETAILS` environment variable
5. Railway auto-detects Python and deploys!

Get the URL and update Vercel as described above.
