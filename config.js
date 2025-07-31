module.exports = {
  // Bot behavior settings
  botSettings: {
    name: "Web3 Community Yapper Bot",
    version: "3.0",
    description:
      "A chatty, friendly, always-engaging Web3/crypto community bot. Posts facts, news, polls, threads, and more.",
  },

  // AI Provider Configuration
  aiProvider: "gemini", // "openai" or "gemini"

  // OpenAI Configuration
  openai: {
    model: "gpt-4o-mini",
    maxTokens: 500,
    temperature: 0.7,
    maxRetries: 2,
  },

  // Google Gemini Configuration
  gemini: {
    model: "gemini-1.5-flash",
    maxTokens: 500,
    temperature: 0.7,
    maxRetries: 2,
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  },

  // AI Prompts - Web3, blockchain, crypto, real-life facts, events, education
  aiPrompts: {
    quotes: `Generate a short, inspirational, or fun quote or fact about blockchain, Web3, crypto, or real-life. It can be a motivational quote, a surprising fact, or a myth-busting statement. Make it relevant to the Web3/crypto community. Format: "Quote or fact" - Author or Source. Keep it under 100 words. void using formatting/bolding on the fonts especially for the headers that would in turn show as asteric (**...**)`,

    techNews: `Generate a short, news-style update or trending topic in the Web3, blockchain, or crypto space. It can be about a new project, a major event, a protocol upgrade, a hack, a partnership, or a real-life application of blockchain. Include 2-3 relevant hashtags. Format: "🚀 [Headline or update] #web3 #blockchain #crypto". Keep it under 150 characters. please avoind using formatting/bolding on the fonts avoid using formatting/bolding on the fonts especially for the headers that would in turn show as asteric (**...**)`,

    polls: `Generate a poll question for the Web3/crypto community. It can be about blockchain, NFTs, DeFi, DAOs, crypto adoption, or real-life use cases. Provide 4 short, engaging options. Format: Question: "..." Options: ["Option 1", "Option 2", "Option 3", "Option 4"] Each option under 20 characters.`,

    threads: `Generate a 5-tweet educational or discussion thread for the Web3/crypto/tech community. Topics: blockchain basics, DeFi, NFTs, DAOs, real-life blockchain use, security tips, event summaries, myth-busting, career opportunities in web3 or trending topics. Each tweet should be short, engaging, and numbered 1️⃣, 2️⃣, 3️⃣. Start with a catchy title and emoji. Each tweet under 200 characters. avoid using formatting/bolding on the fonts especially for the headers that would in turn show as asteric (**...**)`,
  },

  // Scheduling configuration
  schedule: {
    mainActivity: "0 */4 * * *",
    morningQuote: "0 9 * * *",
    lunchPoll: "0 12 * * *",
    afternoonThread: "0 15 * * *",
    eveningNews: "0 18 * * *",
    communityEngagement: "0 */2 * * *",
  },

  // Content weights
  weights: {
    quote: 2,
    techNews: 2,
    poll: 1,
    thread: 3,
    engagement: 4,
  },

  // Target accounts for engagement (Web3/crypto influencers, projects, news)
  targetAccounts: [
    "VitalikButerin",
    "aantonop",
    "balajis",
    "naval",
    "cz_binance",
    "brian_armstrong",
    "ethereum",
    "solana",
    "chainlink",
    "Uniswap",
    "coindesk",
    "cointelegraph",
    "TheBlock__",
    "web3foundation",
    "defipulse",
    "nftnow",
    "0xPolygonLabs",
    "LensProtocol",
    "BanklessHQ",
    "MessariCrypto",
    "LayerZero_Labs",
    "Habib_devv",
    "fkrgohard",
  ],

  // Hashtags to use (Web3/crypto focus)
  hashtags: {
    default: [
      "#Web3",
      "#Crypto",
      "#Blockchain",
      "#DeFi",
      "#NFTs",
      "#CryptoCommunity",
    ],
    quotes: ["#Web3", "#Crypto", "#Blockchain", "#Motivation", "#DidYouKnow"],
    tech: ["#Web3", "#Crypto", "#Blockchain", "#DeFi", "#NFTs"],
    polls: ["#Web3Poll", "#CryptoPoll", "#Blockchain", "#Community"],
    threads: [
      "#Web3Thread",
      "#CryptoEducation",
      "#Blockchain",
      "#DeFi",
      "#NFTs",
    ],
  },

  // Poll settings
  pollSettings: {
    durationMinutes: 1440,
    maxOptions: 4,
  },

  // Thread settings
  threadSettings: {
    delayBetweenTweets: 2000,
    maxTweetsPerThread: 5,
  },

  // Engagement settings (always engage)
  engagementSettings: {
    maxTweetsToCheck: 5,
    likeProbability: 1.0, // Always like
    retweetProbability: 1.0, // Always retweet
    replyProbability: 1.0, // Always reply
  },
};
