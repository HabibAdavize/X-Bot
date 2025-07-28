require('dotenv').config();
const OpenAI = require('openai');
const config = require('./config');

// Check if OpenAI API key is set
console.log('🔑 Checking OpenAI API Key...');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');

if (!process.env.OPENAI_API_KEY) {
    console.log('❌ Please add your OpenAI API key to the .env file');
    process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Test function to generate content
async function testAIGeneration(type) {
    try {
        console.log(`\n🤖 Testing ${type} generation...`);
        
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
        console.log(`✅ ${type.toUpperCase()} generated successfully:`);
        console.log('📝 Content:');
        console.log('─'.repeat(50));
        console.log(content);
        console.log('─'.repeat(50));
        
        // Show token usage
        const usage = response.usage;
        console.log(`📊 Token Usage: ${usage.total_tokens} tokens (Input: ${usage.prompt_tokens}, Output: ${usage.completion_tokens})`);
        
        return content;
    } catch (error) {
        console.error(`❌ Error generating ${type}:`, error.message);
        return null;
    }
}

// Main test function
async function runAITest() {
    console.log('🚀 Starting OpenAI Connection Test...\n');
    
    const testTypes = ['quotes', 'techNews', 'polls', 'threads'];
    
    for (const type of testTypes) {
        await testAIGeneration(type);
        
        // Wait a bit between tests to avoid rate limits
        if (type !== testTypes[testTypes.length - 1]) {
            console.log('\n⏳ Waiting 2 seconds before next test...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎉 All AI tests completed!');
    console.log('✅ If you see content above, your OpenAI connection is working perfectly!');
    console.log('🤖 Your bot is ready to run with: node index.js');
}

// Run the test
runAITest().catch(console.error); 