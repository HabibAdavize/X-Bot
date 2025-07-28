# 🤖 AI Multi-Functional Twitter Bot

A comprehensive, **AI-powered** Twitter bot that uses OpenAI to generate quotes, tech news, polls, threads, and engage with the community automatically.

## ✨ Features

### 🤖 **AI-Powered Content Generation**
- **OpenAI Integration**: All content is generated using GPT-4o-mini
- **Dynamic Content**: No more static content - every post is unique and fresh
- **Intelligent Prompts**: Carefully crafted prompts for each content type
- **Cost Efficient**: Uses GPT-4o-mini for optimal performance/cost ratio

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

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key
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

- **Every 2 hours**: Random AI bot activity (weighted selection)
- **9 AM**: Morning AI-generated inspirational quote
- **12 PM**: AI-generated poll
- **3 PM**: AI-generated educational thread
- **6 PM**: AI-generated tech news
- **Every 4 hours**: Community engagement

## ⚙️ AI Configuration

Edit `config.js` to customize AI behavior:

### OpenAI Settings
```javascript
openai: {
    model: "gpt-4o-mini", // or "gpt-3.5-turbo" for cost efficiency
    maxTokens: 1000,
    temperature: 0.8, // Creative but not too random
    maxRetries: 3
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

### Modify AI Prompts
Edit the `aiPrompts` section in `config.js` to change how AI generates content.

### Adjust Content Weights
Change the frequency of different content types:
```javascript
weights: {
    quote: 2,      // More quotes
    techNews: 2,   // More news
    poll: 1,       // Fewer polls
    thread: 1,     // Fewer threads
    engagement: 3  // More engagement
}
```

### Target Accounts
Edit the `targetAccounts` array to engage with your preferred accounts.

## 📊 Analytics & Storage

The bot saves all AI-generated content to Firebase:

- **AI Generations**: All OpenAI prompts and responses
- **Tweets**: All posted content with AI generation metadata
- **Polls**: AI-generated poll questions and results
- **Threads**: AI-generated thread content
- **Engagements**: Like/retweet activities

## 💰 Cost Management

### OpenAI Usage
- **Model**: GPT-4o-mini (cost-effective)
- **Tokens**: Limited to 1000 per generation
- **Frequency**: Controlled scheduling prevents excessive usage
- **Monitoring**: All API calls are logged

### Cost Optimization Tips
1. Use `gpt-3.5-turbo` instead of `gpt-4o-mini` for lower costs
2. Reduce `maxTokens` in config
3. Adjust scheduling frequency
4. Monitor usage in OpenAI dashboard

## 🛡️ Safety Features

- **Content Filtering**: AI prompts ensure appropriate content
- **Rate Limiting**: Built-in delays to avoid API limits
- **Error Handling**: Comprehensive error catching and logging
- **Fallback Content**: Backup content if AI fails
- **Engagement Limits**: Controlled interaction frequency

## 🚨 Important Notes

1. **OpenAI API Key**: Required for AI content generation
2. **API Costs**: Monitor your OpenAI usage and costs
3. **Content Quality**: AI-generated content is reviewed but may need monitoring
4. **Rate Limits**: Respect both Twitter and OpenAI rate limits
5. **Backup Content**: Consider having fallback content if AI is unavailable

## 🔮 Future Enhancements

- **Real-time news API integration** with AI summarization
- **Image generation** using DALL-E
- **Advanced analytics dashboard** for AI performance
- **Web interface** for bot management
- **Multi-language support** using AI translation
- **Sentiment analysis** for better engagement

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy AI Botting! 🤖✨** 