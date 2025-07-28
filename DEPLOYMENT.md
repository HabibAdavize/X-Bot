# 🚀 Deployment Guide

This guide will help you deploy your AI Twitter Bot to various hosting platforms.

## 🚂 Railway (Recommended)

### Step 1: Prepare Your Repository
1. **Push to GitHub**: Make sure your code is on GitHub
2. **Check files**: Ensure you have these files:
   - `package.json`
   - `index.js`
   - `config.js`
   - `firebaseConfig.js`
   - `serviceAccountKey.json`
   - `.env` (for local testing only)

### Step 2: Deploy to Railway
1. **Go to Railway**: https://railway.app/
2. **Sign up/Login**: Use GitHub account
3. **New Project**: Click "New Project"
4. **Deploy from GitHub**: Select your repository
5. **Wait for build**: Railway will automatically detect Node.js

### Step 3: Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```env
# Twitter API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_token_secret

# AI Providers
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Firebase (if using)
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
```

### Step 4: Upload Firebase Key
1. **Go to Settings** in Railway
2. **Add Variable**: `GOOGLE_APPLICATION_CREDENTIALS`
3. **Upload file**: Upload your `serviceAccountKey.json`

### Step 5: Deploy
1. **Redeploy**: Click "Deploy" button
2. **Check logs**: Monitor deployment in logs
3. **Health check**: Visit your app URL to verify it's running

## ☁️ Render

### Step 1: Prepare for Render
1. **Create account**: https://render.com/
2. **Connect GitHub**: Link your repository

### Step 2: Create Web Service
1. **New Web Service**: Select your repository
2. **Configure**:
   - **Name**: `ai-twitter-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free

### Step 3: Environment Variables
Add the same environment variables as Railway.

### Step 4: Deploy
1. **Create Service**: Click "Create Web Service"
2. **Monitor**: Watch the build process
3. **Verify**: Check the logs for success

## 🐳 DigitalOcean App Platform

### Step 1: Create App
1. **Go to DigitalOcean**: https://cloud.digitalocean.com/
2. **Create App**: Select your GitHub repo
3. **Configure**:
   - **Source**: GitHub repository
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Run Command**: `node index.js`

### Step 2: Environment Variables
Add all required environment variables in the app settings.

### Step 3: Deploy
1. **Create Resources**: Click "Create Resources"
2. **Wait**: Monitor the deployment
3. **Verify**: Check the app URL

## 🎨 Vercel (Limited)

### Step 1: Prepare for Vercel
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`

### Step 2: Deploy
1. **Deploy**: `vercel --prod`
2. **Configure**: Follow prompts
3. **Environment Variables**: Add in Vercel dashboard

### ⚠️ Vercel Limitations
- **No cron jobs**: Use external service like cron-job.org
- **Function timeouts**: Limited to 10-60 seconds
- **Stateless**: No persistent background processes

## 🔧 Environment Variables Reference

### Required Variables
```env
# Twitter API (Required)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_token_secret

# AI Providers (At least one required)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Firebase (Optional)
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
```

### Optional Variables
```env
# Port (Auto-detected by most platforms)
PORT=3000

# Node Environment
NODE_ENV=production
```

## 🧪 Testing Deployment

### Health Check
Visit your deployed app URL to see:
```json
{
  "status": "OK",
  "message": "AI Twitter Bot is running! 🤖",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "provider": "gemini",
  "uptime": 123.456
}
```

### Manual Trigger
You can manually trigger bot activities by visiting:
- `/quote` - Generate and post a quote
- `/news` - Generate and post tech news
- `/poll` - Create a poll
- `/thread` - Create a thread
- `/engage` - Engage with community

## 📊 Monitoring

### Logs
- **Railway**: Built-in log viewer
- **Render**: Logs tab in dashboard
- **DigitalOcean**: App logs in console
- **Vercel**: Function logs in dashboard

### Health Monitoring
- **Uptime**: Check app URL regularly
- **Twitter Activity**: Monitor your bot's Twitter account
- **Firebase**: Check data collection
- **AI Usage**: Monitor API usage in respective dashboards

## 🔄 Updates

### Automatic Deployments
Most platforms support automatic deployments:
1. **Push to GitHub**: Any push to main branch
2. **Auto-deploy**: Platform rebuilds and deploys
3. **Zero downtime**: New version replaces old

### Manual Updates
1. **Update code**: Make changes locally
2. **Push to GitHub**: `git push origin main`
3. **Monitor deployment**: Check platform dashboard

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- **Check dependencies**: Ensure all packages in `package.json`
- **Node version**: Specify in `package.json` if needed
- **Build logs**: Check platform-specific logs

#### Runtime Errors
- **Environment variables**: Verify all required vars are set
- **API keys**: Check if keys are valid and have permissions
- **Firebase**: Ensure service account key is uploaded

#### Bot Not Posting
- **Twitter permissions**: Check app has "Read and Write" access
- **Rate limits**: Bot might be hitting Twitter API limits
- **AI provider**: Check if Gemini/OpenAI is working

### Debug Commands
```bash
# Check environment variables
echo $TWITTER_API_KEY

# Test AI connection
node test-gemini.js

# Test Twitter connection
node -e "require('./index.js')"
```

## 💰 Cost Considerations

### Free Tiers
- **Railway**: $5/month free tier
- **Render**: Free tier available
- **DigitalOcean**: $5/month minimum
- **Vercel**: Generous free tier

### AI Costs
- **Gemini**: Free tier (15 req/min)
- **OpenAI**: $5 free credit for 3 months

## 🎯 Best Practices

1. **Use Railway**: Best for long-running bots
2. **Monitor logs**: Check regularly for errors
3. **Backup data**: Use Firebase for persistence
4. **Test locally**: Always test before deploying
5. **Environment variables**: Never commit secrets to Git

## 🆘 Support

If you encounter issues:
1. **Check logs**: Platform-specific log viewers
2. **Verify config**: Ensure all variables are set
3. **Test locally**: Run `node index.js` locally first
4. **Platform docs**: Check hosting platform documentation

---

**Happy Deploying! 🚀🤖** 