require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const db = require('./firebaseConfig'); // Import Firestore setup


// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Function to post a tweet
async function postTweet(content) {
    try {
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
      console.error('Error posting tweet or saving to Firestore:', error);
    }
  }
  

// Example: Post a tweet
postTweet('Hello, Twitter! This is my first bot tweet!');
