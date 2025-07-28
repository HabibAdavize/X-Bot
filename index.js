require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const db = require('./firebaseConfig'); 
const schedule = require('node-schedule');

// Check if environment variables are loaded
console.log('Environment check:');
console.log('TWITTER_API_KEY:', process.env.TWITTER_API_KEY ? '✓ Set' : '✗ Missing');
console.log('TWITTER_API_SECRET:', process.env.TWITTER_API_SECRET ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_TOKEN:', process.env.TWITTER_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
console.log('TWITTER_ACCESS_SECRET:', process.env.TWITTER_ACCESS_SECRET ? '✓ Set' : '✗ Missing');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

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
        createdAt: new Date().toISOString(),
      };
  
      await db.collection('tweets').add(tweetData);
      console.log('Tweet saved to Firestore:', tweetData);
    } catch (error) {
      console.error('Error posting tweet or saving to Firestore:', error.message);
      console.error('Full error:', error);
    }
  }
  

// Example: Post a tweet
console.log('Starting bot...');
postTweet('Hello, Twitter! This is my first bot tweet!');

// Schedule a tweet for 5 minutes from now
const scheduledTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
console.log(`Scheduling next tweet for: ${scheduledTime.toLocaleString()}`);

schedule.scheduleJob(scheduledTime, () => {
  const messages = [
    "🤖 Bot is alive and tweeting! #TwitterBot #Automation",
    "Just checking in with my human followers! 👋 #BotLife",
    "Another automated message from your friendly neighborhood bot! 🤖✨",
    "Time for a scheduled tweet! ⏰ #ScheduledTweets"
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  postTweet(randomMessage);
});

console.log('Bot is running and will post scheduled tweets...');
