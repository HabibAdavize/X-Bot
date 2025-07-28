# 🤖 AI Multi-Functional Twitter Bot

A comprehensive, **AI-powered** Twitter bot that uses **Google Gemini** (with OpenAI fallback) to generate quotes, tech news, polls, threads, and engage with the community automatically.

## ✨ Features

### 🤖 **AI-Powered Content Generation**
- **Google Gemini Integration**: Primary AI provider with generous free tier
- **OpenAI Fallback**: Automatic fallback if Gemini fails
- **Fallback Content**: Static content if both AI providers fail
- **Dynamic Content**: No more static content - every post is unique and fresh
- **Intelligent Prompts**: Carefully crafted prompts for each content type

### 📚 **AI Quote Bot**
- **Dynamic Quotes**: AI generates inspirational quotes about technology and innovation
- **Authentic Authors**: AI creates realistic author attributions
- **Smart Categorization**: Automatic hashtag generation based on content

### 💻 **AI Tech News Bot**
- **Breaking News**: AI generates realistic tech news headlines
- **Current Topics**: Covers AI, programming, cybersecurity, and more
- **Engaging Format**: Includes relevant emojis and hashtags

### 📊 **AI Poll Bot**
- **Interactive Questions**: AI generates engaging poll questions
- **Smart Options**: Creates relevant answer choices
- **24-hour Duration**: Polls run for a full day

### 🧵 **AI Thread Bot**
- **Educational Content**: AI creates informative tweet threads
- **Multiple Topics**: Programming tips, AI tools, productivity hacks
- **Proper Formatting**: Numbered tweets with emojis

### 🤝 **Engagement Bot**
- **Smart Targeting**: Engages with tech leaders and companies
- **Natural Interactions**: Likes and retweets with thoughtful commentary
- **Rate Limited**: Respects Twitter's API limits

## 🚀 Quick Start

### 1. Setup Environment Variables
Create a `.env` file with your API credentials:

```env
# Twitter API Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_token_secret

# AI Provider API Keys (at least one required)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional fallback
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
- Download your `serviceAccountKey.json` from Firebase Console
- Place it in the project root

### 4. Run the AI Bot
```bash
node index.js
```

## 📅 AI Bot Schedule

The bot runs on a smart schedule with AI-generated content:

- **Every 4 hours**: Random AI bot activity (weighted selection)
- **9 AM**: Morning AI-generated inspirational quote
- **12 PM**: AI-generated poll
- **3 PM**: AI-generated educational thread
- **6 PM**: AI-generated tech news
- **Every 6 hours**: Community engagement

## ⚙️ AI Configuration

Edit `config.js` to customize AI behavior:

### AI Provider Selection
```javascript
aiProvider: "gemini", // "openai" or "gemini"
```

### Google Gemini Settings
```javascript
gemini: {
    model: "gemini-1.5-flash", // Fast and efficient model
    maxTokens: 500,
    temperature: 0.7,
    maxRetries: 2
}
```

### OpenAI Settings (Fallback)
```javascript
openai: {
    model: "gpt-4o-mini",
    maxTokens: 500,
    temperature: 0.7,
    maxRetries: 2
}
```

### AI Prompts
Customize the prompts for each content type:
- **Quotes**: Generate inspirational tech quotes
- **Tech News**: Create breaking tech news headlines
- **Polls**: Generate engaging poll questions
- **Threads**: Create educational tweet threads

## 🎯 AI-Generated Content Examples

### Quotes
```
"The best code is the code that never needs to be written." - Ada Lovelace
#motivation #programming #inspiration
```

### Tech News
```
🚀 OpenAI releases GPT-5 with enhanced reasoning capabilities! #AI #OpenAI
```

### Polls
```
What's your favorite programming language for AI development?
[Python, JavaScript, Rust, Julia]
```

### Threads
```
🤖 5 Essential AI Tools Every Developer Should Know

1️⃣ GitHub Copilot - Your AI pair programmer
2️⃣ ChatGPT - Great for debugging and explanations
3️⃣ Claude - Excellent for code review
4️⃣ Cursor - AI-powered code editor
5️⃣ Replit Ghost - AI project builder
```

## 🔧 Customization

### Switch AI Providers
Change `aiProvider` in `config.js`:
- `"gemini"` - Use Google Gemini (recommended)
- `"openai"` - Use OpenAI (if you have credits)

### Modify AI Prompts
Edit the `aiPrompts` section in `config.js` to change how AI generates content.

### Adjust Content Weights
Change the frequency of different content types:
```javascript
weights: {
    quote: 3,        // More quotes (cheaper)
    techNews: 2,     // Moderate news
    poll: 1,         // Fewer polls (more complex)
    thread: 1,       // Fewer threads (more tokens)
    engagement: 4    // More engagement (no AI cost)
}
```

### Target Accounts
Edit the `targetAccounts` array to engage with your preferred accounts.

## 📊 Analytics & Storage

The bot saves all AI-generated content to Firebase:

- **AI Generations**: All AI prompts and responses with provider info
- **Tweets**: All posted content with AI generation metadata
- **Polls**: AI-generated poll questions and results
- **Threads**: AI-generated thread content
- **Engagements**: Like/retweet activities

## 💰 Cost Management

### Google Gemini (Recommended)
- **Free Tier**: 15 requests per minute
- **Generous Daily Limits**: Much more than OpenAI
- **High Quality**: Latest Gemini model
- **No Credit Card**: Required initially

### OpenAI (Fallback)
- **Free Tier**: $5 credit for 3 months
- **Cost**: ~$0.0015 per post
- **Quality**: Excellent but limited free tier

### Cost Optimization Tips
1. Use **Gemini as primary** (better free tier)
2. Keep **OpenAI as fallback** only
3. Monitor usage in respective dashboards
4. Adjust scheduling frequency if needed

## 🛡️ Safety Features

- **Content Filtering**: AI prompts ensure appropriate content
- **Rate Limiting**: Built-in delays to avoid API limits
- **Error Handling**: Comprehensive error catching and logging
- **Fallback Content**: Static content if AI fails
- **Engagement Limits**: Controlled interaction frequency
- **Safety Settings**: Built-in content safety filters

## 🚨 Important Notes

1. **Gemini API Key**: Required for primary AI functionality
2. **OpenAI API Key**: Optional for fallback
3. **API Costs**: Monitor your usage and costs
4. **Content Quality**: AI-generated content is reviewed but may need monitoring
5. **Rate Limits**: Respect both Twitter and AI provider limits
6. **Fallback System**: Bot works even if AI providers fail

## 🧪 Testing

### Test Gemini Connection
```bash
node test-gemini.js
```

### Test OpenAI Connection
```bash
node test-ai.js
```

### Test Full Bot
```bash
node index.js
```

## 🔮 Future Enhancements

- **Real-time news API integration** with AI summarization
- **Image generation** using DALL-E or Gemini Vision
- **Advanced analytics dashboard** for AI performance
- **Web interface** for bot management
- **Multi-language support** using AI translation
- **Sentiment analysis** for better engagement
- **Local AI models** (Ollama) for complete privacy

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy AI Botting with Gemini! 🤖✨** 