require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const db = require('./firebaseConfig'); 
const schedule = require('node-schedule');
const config = require('./config');

// Check if environment variables are loaded
console.log('Environment check:');
console.log('TWITTER_API_KEY:', process.env.TWITTER_API_KEY ? '✓ Set' : '✗ Missing');
console.log('TWITTER_API_SECRET:', process.env.TWITTER_API_SECRET ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_TOKEN:', process.env.TWITTER_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_SECRET:', process.env.TWITTER_ACCESS_SECRET ? '✓ Set' : '✗ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Target accounts to engage with
const targetAccounts = config.targetAccounts;

// Function to generate content using OpenAI
async function generateAIContent(type) {
    try {
        console.log(`🤖 Generating ${type} content with AI...`);
        
        const prompt = config.aiPrompts[type];
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

        const content = response.choices[0].message.content.trim();
        console.log(`✅ AI generated ${type}:`, content);
        
        // Save AI generation to Firebase
        await db.collection('ai_generations').add({
            type,
            prompt,
            content,
            model: config.openai.model,
            createdAt: new Date().toISOString(),
        });

        return content;
    } catch (error) {
        console.error(`❌ Error generating ${type} with AI:`, error.message);
        return null;
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
            
            // Like the tweet
            if (Math.random() < config.engagementSettings.likeProbability) {
                await client.v2.like(randomTweet.id);
                console.log(`Liked tweet: ${randomTweet.id}`);
            }
            
            // Retweet with comment (quote tweet)
            if (Math.random() < config.engagementSettings.retweetProbability) {
                const retweetText = `Great insights! Thanks for sharing @${targetAccount} 🙏\n\n${config.hashtags.default.join(' ')}`;
                await client.v2.tweet({
                    text: retweetText,
                    quote_tweet_id: randomTweet.id
                });
                console.log(`Quote tweeted: ${randomTweet.id}`);
            }
            
            // Save engagement to Firebase
            await db.collection('engagements').add({
                targetAccount,
                tweetId: randomTweet.id,
                action: 'like_and_quote',
                createdAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error('Error engaging with accounts:', error.message);
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

// Schedule regular bot activities
console.log('Starting AI-powered bot...');

// Initial post
postTweet('🤖 Hello Twitter! I\'m your new AI-powered multi-functional bot! I generate quotes, tech news, polls, and threads using OpenAI! #TwitterBot #AI #Tech');

// Schedule bot activities every 2 hours
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
console.log('  - Every 2 hours: Random AI bot activity');
console.log('  - 9 AM: Morning AI quote');
console.log('  - 12 PM: AI-generated poll');
console.log('  - 3 PM: AI-generated thread');
console.log('  - 6 PM: AI tech news');
console.log('  - Every 4 hours: Community engagement');
console.log('🤖 All content is now AI-generated using OpenAI!');
