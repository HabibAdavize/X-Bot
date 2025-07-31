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
  quotes: `Generate a short, inspirational, or interesting quote or fact about blockchain, Web3, crypto, or real life. It can be motivational, surprising, or myth-busting—just make sure it's relevant to the Web3/crypto audience. 
  Format: "Quote or fact" - Author or Source. 
  Keep it under 100 words.
  ❌ Avoid any bold text formatting (e.g., **bold**) in the output.`,

  techNews: `Generate a short, news-style update or trending topic in the Web3, blockchain, or crypto space. Focus on new projects, major events, token launches, protocol upgrades, hacks, partnerships, or unique real-life blockchain use cases. Occasionally mention fast-rising or trending tokens or communities (e.g. $YAP, $DEGEN, $BASED) when relevant — but don’t overdo it.
  Include 2–3 relevant hashtags like #web3 #crypto #blockchain.
  Format: "🚀 [Headline or update] #web3 #crypto ..."
  Keep it under 150 characters.
  ❌ Avoid using bold text formatting (e.g., **bold**) in the output.`,

  polls: `Generate a poll question for the Web3/crypto community. The topic can be about blockchain, NFTs, DeFi, DAOs, crypto adoption, or real-world use cases. 
  Provide 4 concise, engaging options.
  Format: 
  Question: "..."
  Options: ["Option 1", "Option 2", "Option 3", "Option 4"]
  Each option should be under 20 characters.
  ❌ Avoid bold formatting and special characters.`,

  threads: `Generate a 5-tweet Twitter/X thread on a randomly selected Web3 or crypto topic. Choose from: Blockchain Basics, DeFi, NFTs, DAOs, Security, Real-World Use Cases, Myth Busting, Event Recaps, Career Advice, or Trends.

  Guidelines:
  - Start with a catchy hook and emoji.
  - Be informative yet simple to understand.
  - Use 1️⃣ to 5️⃣ for numbering.
  - Keep each tweet under 200 characters.
  - ❌ Do NOT use bold formatting or hashtags.
  - Avoid repeating headers or phrases in each tweet.
  
  Write in a friendly, conversational tone that works for both beginners and curious devs.`
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
