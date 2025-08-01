require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./firebaseConfig'); 
const schedule = require('node-schedule');
const config = require('./config');
const http = require('http');

// Check if environment variables are loaded
console.log('Environment check:');
console.log('TWITTER_API_KEY:', process.env.TWITTER_API_KEY ? '✓ Set' : '✗ Missing');
console.log('TWITTER_API_SECRET:', process.env.TWITTER_API_SECRET ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_TOKEN:', process.env.TWITTER_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_SECRET:', process.env.TWITTER_ACCESS_SECRET ? '✓ Set' : '✗ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Initialize AI providers
let openai = null;
let gemini = null;

if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

if (process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Target accounts to engage with
const targetAccounts = config.targetAccounts;

// Function to generate content using AI (supports both OpenAI and Gemini)
async function generateAIContent(type) {
    try {
        console.log(`🤖 Generating ${type} content with ${config.aiProvider.toUpperCase()}...`);
        
        const prompt = config.aiPrompts[type];
        let content = null;
        let modelUsed = null;

        // Try Gemini first (if configured as primary)
        if (config.aiProvider === 'gemini' && gemini) {
            try {
                const geminiModel = gemini.getGenerativeModel({
                    model: config.gemini.model,
                    generationConfig: {
                        maxOutputTokens: config.gemini.maxTokens,
                        temperature: config.gemini.temperature,
                    },
                    safetySettings: config.gemini.safetySettings,
                });

                const result = await geminiModel.generateContent(prompt);
                content = result.response.text().trim();
                modelUsed = `gemini-${config.gemini.model}`;
                console.log(`✅ Gemini generated ${type}:`, content);
            } catch (error) {
                console.log(`⚠️ Gemini failed, trying OpenAI...`);
            }
        }

        // Try OpenAI if Gemini failed or not configured
        if (!content && openai) {
            try {
                const response = await openai.chat.completions.create({
                    model: config.openai.model,
                    messages: [
                        {
                            role: "system",
                            content: `You are a Twitter bot that creates engaging content for developers and tech enthusiasts. Be creative, informative, and authentic.`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: config.openai.maxTokens,
                    temperature: config.openai.temperature,
                });

                content = response.choices[0].message.content.trim();
                modelUsed = `openai-${config.openai.model}`;
                console.log(`✅ OpenAI generated ${type}:`, content);
            } catch (error) {
                console.log(`⚠️ OpenAI failed:`, error.message);
            }
        }

        // Fallback content if both AI providers fail
        if (!content) {
            console.log(`❌ Both AI providers failed, using fallback content`);
            content = getFallbackContent(type);
            modelUsed = 'fallback';
        }
        
        // Save AI generation to Firebase
        await db.collection('ai_generations').add({
            type,
            prompt,
            content,
            model: modelUsed,
            provider: config.aiProvider,
            createdAt: new Date().toISOString(),
        });

        return content;
    } catch (error) {
        console.error(`❌ Error generating ${type} with AI:`, error.message);
        return getFallbackContent(type);
    }
}

// Fallback content function
function getFallbackContent(type) {
    const fallbackContent = {
        quotes: [
            '"The best code is the code that never needs to be written." - Ada Lovelace',
            '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
            '"Stay hungry, stay foolish." - Steve Jobs',
            '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt'
        ],
        techNews: [
            '🚀 New AI breakthrough in machine learning! #AI #Tech',
            '💻 Revolutionary programming language released! #Programming #Innovation',
            '🔒 Major cybersecurity update available! #Security #Tech',
            '☁️ Cloud computing reaches new heights! #Cloud #Technology'
        ],
        polls: {
            questions: [
                "What's your favorite programming language?",
                "Which tech trend excites you most?",
                "What's your preferred development environment?",
                "Which AI tool do you find most useful?"
            ],
            options: [
                ["JavaScript", "Python", "Java", "C++"],
                ["AI/ML", "Web3", "Cloud", "Cybersecurity"],
                ["VS Code", "IntelliJ", "Vim", "Sublime"],
                ["ChatGPT", "GitHub Copilot", "Claude", "Bard"]
            ]
        },
        threads: [
            "🚀 3 Essential Tips for New Developers\n\n1️⃣ Start with fundamentals\n2️⃣ Build real projects\n3️⃣ Join communities",
            "🤖 AI Tools Every Developer Should Know\n\n1️⃣ GitHub Copilot\n2️⃣ ChatGPT\n3️⃣ Claude",
            "💡 Productivity Hacks for Developers\n\n1️⃣ Use keyboard shortcuts\n2️⃣ Set up good tools\n3️⃣ Take breaks"
        ]
    };

    switch (type) {
        case 'quotes':
            return fallbackContent.quotes[Math.floor(Math.random() * fallbackContent.quotes.length)];
        case 'techNews':
            return fallbackContent.techNews[Math.floor(Math.random() * fallbackContent.techNews.length)];
        case 'polls':
            const pollIndex = Math.floor(Math.random() * fallbackContent.polls.questions.length);
            return `Question: ${fallbackContent.polls.questions[pollIndex]}\nOptions: ${JSON.stringify(fallbackContent.polls.options[pollIndex])}`;
        case 'threads':
            return fallbackContent.threads[Math.floor(Math.random() * fallbackContent.threads.length)];
        default:
            return "🤖 AI-powered content coming soon! #Tech #Innovation";
    }
}

// Function to post a tweet
async function postTweet(content) {
    try {
      console.log('Attempting to post tweet:', content);
      const tweet = await client.v2.tweet(content);
      console.log('Tweet posted successfully:', tweet.data);
  
      // Save to Firebase
      const tweetData = {
        content,
        tweetId: tweet.data.id,
        type: 'tweet',
        createdAt: new Date().toISOString(),
      };
  
      await db.collection('tweets').add(tweetData);
      console.log('Tweet saved to Firestore:', tweetData);
      return tweet.data.id;
    } catch (error) {
      console.error('Error posting tweet:', error.message);
      return null;
    }
}

// Function to post an AI-generated quote
async function postQuote() {
    const aiQuote = await generateAIContent('quotes');
    if (aiQuote) {
        const hashtags = config.hashtags.quotes.join(' ');
        const content = `${aiQuote}\n\n${hashtags}`;
        return await postTweet(content);
    }
    return null;
}

// Function to create and post an AI-generated poll
async function createPoll() {
    try {
        const aiPoll = await generateAIContent('polls');
        if (!aiPoll) return null;

        // Parse AI response to extract question and options
        const lines = aiPoll.split('\n');
        let question = '';
        let options = [];

        for (const line of lines) {
            if (line.toLowerCase().includes('question:')) {
                question = line.split('Question:')[1]?.trim() || line.split('question:')[1]?.trim();
            } else if (line.toLowerCase().includes('options:')) {
                const optionsText = line.split('Options:')[1]?.trim() || line.split('options:')[1]?.trim();
                // Parse options array format
                if (optionsText.includes('[') && optionsText.includes(']')) {
                    options = optionsText.replace(/[\[\]"]/g, '').split(',').map(opt => opt.trim());
                }
            }
        }

        // Fallback parsing if the above doesn't work
        if (!question || options.length === 0) {
            const parts = aiPoll.split('\n');
            question = parts[0] || "What's your favorite tech topic?";
            options = parts.slice(1).filter(part => part.trim().length > 0).slice(0, 4);
        }

        // Ensure we have exactly 4 options
        while (options.length < 4) {
            options.push(`Option ${options.length + 1}`);
        }
        options = options.slice(0, 4);

        console.log('Creating AI-generated poll:', question);
        
        const poll = await client.v2.tweet({
            text: `${question}\n\n${config.hashtags.polls.join(' ')}`,
            poll: {
                options: options,
                duration_minutes: config.pollSettings.durationMinutes
            }
        });
        
        console.log('Poll created successfully:', poll.data);
        
        // Save to Firebase
        const pollData = {
            question,
            options,
            pollId: poll.data.id,
            type: 'ai_poll',
            aiGenerated: true,
            createdAt: new Date().toISOString(),
        };
        
        await db.collection('polls').add(pollData);
        console.log('Poll saved to Firestore:', pollData);
        return poll.data.id;
    } catch (error) {
        console.error('Error creating AI poll:', error.message);
        return null;
    }
}

// Function to create an AI-generated thread
async function createThread() {
    try {
        const aiThread = await generateAIContent('threads');
        if (!aiThread) return null;

        // Split the AI response into individual tweets
        const tweets = aiThread.split('\n').filter(line => line.trim().length > 0);
        
        console.log('Creating AI-generated thread with', tweets.length, 'tweets');
        
        let previousTweetId = null;
        
        for (let i = 0; i < tweets.length && i < config.threadSettings.maxTweetsPerThread; i++) {
            const tweetText = tweets[i];
            
            const tweet = await client.v2.tweet({
                text: tweetText,
                ...(previousTweetId && { reply: { in_reply_to_tweet_id: previousTweetId } })
            });
            
            previousTweetId = tweet.data.id;
            console.log(`Thread tweet ${i + 1} posted:`, tweet.data.id);
            
            // Save to Firebase
            await db.collection('threads').add({
                threadId: previousTweetId,
                tweetIndex: i,
                content: tweetText,
                type: 'ai_thread',
                aiGenerated: true,
                createdAt: new Date().toISOString(),
            });
            
            // Wait between tweets to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, config.threadSettings.delayBetweenTweets));
        }
        
        console.log('AI thread completed successfully');
        return previousTweetId;
    } catch (error) {
        console.error('Error creating AI thread:', error.message);
        return null;
    }
}

// Function to engage with target accounts
async function engageWithAccounts() {
    try {
        const targetAccount = targetAccounts[Math.floor(Math.random() * targetAccounts.length)];
        console.log(`Engaging with account: @${targetAccount}`);
        
        // Get recent tweets from the target account
        const user = await client.v2.userByUsername(targetAccount);
        if (!user.data) {
            console.log(`Could not find user: @${targetAccount}`);
            return;
        }
        
        const tweets = await client.v2.userTimeline(user.data.id, {
            max_results: config.engagementSettings.maxTweetsToCheck,
            exclude: ['retweets', 'replies']
        });
        
        if (tweets.data && tweets.data.length > 0) {
            const randomTweet = tweets.data[Math.floor(Math.random() * tweets.data.length)];
            const tweetText = randomTweet.text;
            
            // Always like the tweet
            await client.v2.like(randomTweet.id);
            console.log(`Liked tweet: ${randomTweet.id}`);
            
            // Generate AI-powered quote tweet (retweet with comment)
            const quotePrompt = `You are a friendly, chatty Web3 community bot. Write a positive, insightful quote tweet (retweet with comment) for this tweet, referencing the content and adding value for the Web3/crypto community. Keep it under 200 characters.\n\nOriginal tweet: "${tweetText}"`;
            const quoteText = await generateEngagementAI(quotePrompt);
            await client.v2.tweet({
                text: quoteText,
                quote_tweet_id: randomTweet.id
            });
            console.log(`Quote tweeted: ${randomTweet.id}`);
            
            // Generate AI-powered reply
            const replyPrompt = `You are a friendly, chatty Web3 community bot. Write a reply to this tweet that is helpful, engaging, and encourages discussion in the Web3/crypto space. Keep it under 200 characters.\n\nOriginal tweet: "${tweetText}"`;
            const replyText = await generateEngagementAI(replyPrompt);
            await client.v2.reply(replyText, randomTweet.id);
            console.log(`Replied to tweet: ${randomTweet.id}`);
            
            // Save engagement to Firebase (or mock)
            await db.collection('engagements').add({
                targetAccount,
                tweetId: randomTweet.id,
                action: 'like_retweet_reply',
                createdAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error('Error engaging with accounts:', error.message);
    }
}

// Helper function to generate engagement text using Gemini
async function generateEngagementAI(prompt) {
    try {
        if (gemini) {
            const geminiModel = gemini.getGenerativeModel({
                model: config.gemini.model,
                generationConfig: {
                    maxOutputTokens: 200,
                    temperature: config.gemini.temperature,
                },
                safetySettings: config.gemini.safetySettings,
            });
            const result = await geminiModel.generateContent(prompt);
            return result.response.text().trim();
        } else if (openai) {
            const response = await openai.chat.completions.create({
                model: config.openai.model,
                messages: [
                    { role: "system", content: "You are a friendly, chatty Web3 community bot." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 200,
                temperature: config.openai.temperature,
            });
            return response.choices[0].message.content.trim();
        } else {
            return "Love this insight! 🚀 #Web3 #Crypto";
        }
    } catch (error) {
        console.error('Error generating engagement AI:', error.message);
        return "Great post! #Web3 #Crypto";
    }
}

// Function to post AI-generated tech news
async function postTechNews() {
    const aiNews = await generateAIContent('techNews');
    if (aiNews) {
        return await postTweet(aiNews);
    }
    return null;
}

// Main bot function
async function runBot() {
    console.log('🤖 AI Multi-functional Bot starting...');
    
    const actions = [
        { name: 'Quote', func: postQuote, weight: config.weights.quote },
        { name: 'Tech News', func: postTechNews, weight: config.weights.techNews },
        { name: 'Poll', func: createPoll, weight: config.weights.poll },
        { name: 'Thread', func: createThread, weight: config.weights.thread },
        { name: 'Engagement', func: engageWithAccounts, weight: config.weights.engagement }
    ];
    
    // Weighted random selection
    const totalWeight = actions.reduce((sum, action) => sum + action.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const action of actions) {
        random -= action.weight;
        if (random <= 0) {
            console.log(`🎯 Executing: ${action.name}`);
            await action.func();
            break;
        }
    }
}

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'OK',
        message: 'AI Twitter Bot is running! 🤖',
        timestamp: new Date().toISOString(),
        provider: config.aiProvider,
        uptime: process.uptime()
    }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🌐 Health check server running on port ${PORT}`);
});

// Schedule regular bot activities
console.log('Starting AI-powered bot with Gemini...');

// Initial post
postTweet('👀🔃');

// Schedule bot activities every 4 hours
schedule.scheduleJob(config.schedule.mainActivity, () => {
    console.log('⏰ Scheduled bot activity triggered');
    runBot();
});

// Schedule specific activities
schedule.scheduleJob(config.schedule.morningQuote, () => {
    console.log('🌅 Morning AI quote time!');
    postQuote();
});

schedule.scheduleJob(config.schedule.lunchPoll, () => {
    console.log('📊 Lunch time AI poll!');
    createPoll();
});

schedule.scheduleJob(config.schedule.afternoonThread, () => {
    console.log('🧵 Afternoon AI thread time!');
    createThread();
});

schedule.scheduleJob(config.schedule.eveningNews, () => {
    console.log('💻 Evening AI tech news!');
    postTechNews();
});

schedule.scheduleJob(config.schedule.communityEngagement, () => {
    console.log('🤝 Time to engage with the community!');
    engageWithAccounts();
});

console.log('🤖 AI Bot is running and will execute scheduled activities...');
console.log('📅 Schedule:');
console.log('  - Every 4 hours: Random AI bot activity');
console.log('  - 9 AM: Morning AI quote');
console.log('  - 12 PM: AI-generated poll');
console.log('  - 3 PM: AI-generated thread');
console.log('  - 6 PM: AI tech news');
console.log('  - Every 6 hours: Community engagement');
console.log(`🤖 Using ${config.aiProvider.toUpperCase()} for AI content generation!`);
