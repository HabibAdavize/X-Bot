module.exports = {
    // Bot behavior settings
    botSettings: {
        name: "AI Multi-Functional Bot",
        version: "2.0",
        description: "A comprehensive Twitter bot with quotes, tech news, polls, threads, and engagement features"
    },

    // OpenAI Configuration - Optimized for Free Tier
    openai: {
        model: "gpt-4o-mini", // Most cost-effective model
        maxTokens: 500, // Reduced from 1000 to save tokens
        temperature: 0.7, // Slightly lower for more consistent output
        maxRetries: 2 // Reduced retries to save API calls
    },

    // AI Prompts - Optimized for shorter responses
    aiPrompts: {
        quotes: `Generate a short inspirational quote about technology or programming. 
        Format: "Quote text" - Author Name
        Keep it under 100 words. Make it relevant to developers.`,

        techNews: `Generate a short tech news headline about AI, programming, or software. 
        Make it sound like breaking news. Include 2-3 hashtags.
        Format: "🚀 [Headline] #hashtag1 #hashtag2"
        Keep it under 150 characters.`,

        polls: `Generate a tech poll question with 4 short options. 
        Make it engaging for developers.
        Format: 
        Question: "What's your favorite..."
        Options: ["Option 1", "Option 2", "Option 3", "Option 4"]
        Keep each option under 20 characters.`,

        threads: `Generate a 3-tweet educational thread about a tech topic. 
        Topics: programming tips, AI tools, productivity.
        Make each tweet short and engaging. Number them 1️⃣, 2️⃣, 3️⃣.
        Start with a title and emoji. Keep each tweet under 200 characters.`
    },

    // Scheduling configuration - Reduced frequency for free tier
    schedule: {
        // Main bot activity (every 4 hours instead of 2)
        mainActivity: '0 */4 * * *',
        
        // Specific activities - reduced frequency
        morningQuote: '0 9 * * *',
        lunchPoll: '0 12 * * *',
        afternoonThread: '0 15 * * *',
        eveningNews: '0 18 * * *',
        communityEngagement: '0 */6 * * *' // Every 6 hours instead of 4
    },

    // Content weights - Adjusted for free tier
    weights: {
        quote: 3,        // More quotes (cheaper)
        techNews: 2,     // Moderate news
        poll: 1,         // Fewer polls (more complex)
        thread: 1,       // Fewer threads (more tokens)
        engagement: 4    // More engagement (no AI cost)
    },

    // Target accounts for engagement
    targetAccounts: [
        // Tech leaders
        "elonmusk", "sundarpichai", "satyanadella", "tim_cook",
        
        // Tech companies
        "OpenAI", "Google", "Microsoft", "Apple",
        
        // Developer platforms
        "github", "stackoverflow", "techcrunch", "verge",
        
        // Add your own targets here
        "Habib_devv", "your_target_account2"
    ],

    // Hashtags to use
    hashtags: {
        default: ["#TwitterBot", "#AI", "#Tech"],
        quotes: ["#quotes", "#inspiration", "#motivation"],
        tech: ["#tech", "#innovation", "#programming"],
        polls: ["#poll", "#tech", "#community"],
        threads: ["#thread", "#tech", "#tips"]
    },

    // Poll settings
    pollSettings: {
        durationMinutes: 1440, // 24 hours
        maxOptions: 4
    },

    // Thread settings - Reduced for free tier
    threadSettings: {
        delayBetweenTweets: 2000, // 2 seconds
        maxTweetsPerThread: 3 // Reduced from 5 to 3
    },

    // Engagement settings
    engagementSettings: {
        maxTweetsToCheck: 5,
        likeProbability: 0.8, // 80% chance to like
        retweetProbability: 0.6, // 60% chance to retweet
        replyProbability: 0.3 // 30% chance to reply
    }
}; 