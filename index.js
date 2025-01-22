require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function testConnection() {
  try {
    const user = await client.currentUser();
    console.log(`Logged in as ${user.name}`);
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
  }
}

testConnection();
