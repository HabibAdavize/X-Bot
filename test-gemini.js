require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

// Check if Gemini API key is set
console.log('🔑 Checking Google Gemini API Key...');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');

if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Please add your Gemini API key to the .env file');
    console.log('💡 Get it from: https://makersuite.google.com/app/apikey');
    process.exit(1);
}

// Initialize Gemini
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test function to generate content using Gemini
async function testGeminiGeneration(type) {
    try {
        console.log(`\n🤖 Testing ${type} generation with Gemini...`);
        
        const prompt = config.aiPrompts[type];
        const geminiModel = gemini.getGenerativeModel({
            model: config.gemini.model,
            generationConfig: {
                maxOutputTokens: config.gemini.maxTokens,
                temperature: config.gemini.temperature,
            },
            safetySettings: config.gemini.safetySettings,
        });

        const result = await geminiModel.generateContent(prompt);
        const content = result.response.text().trim();
        
        console.log(`✅ ${type.toUpperCase()} generated successfully with Gemini:`);
        console.log('📝 Content:');
        console.log('─'.repeat(50));
        console.log(content);
        console.log('─'.repeat(50));
        
        // Show usage info if available
        if (result.response.usageMetadata) {
            const usage = result.response.usageMetadata;
            console.log(`📊 Token Usage: ${usage.totalTokenCount} tokens`);
        }
        
        return content;
    } catch (error) {
        console.error(`❌ Error generating ${type} with Gemini:`, error.message);
        return null;
    }
}

// Main test function
async function runGeminiTest() {
    console.log('🚀 Starting Google Gemini Connection Test...\n');
    
    const testTypes = ['quotes', 'techNews', 'polls', 'threads'];
    
    for (const type of testTypes) {
        await testGeminiGeneration(type);
        
        // Wait a bit between tests to avoid rate limits
        if (type !== testTypes[testTypes.length - 1]) {
            console.log('\n⏳ Waiting 2 seconds before next test...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎉 All Gemini tests completed!');
    console.log('✅ If you see content above, your Gemini connection is working perfectly!');
    console.log('🤖 Your bot is ready to run with: node index.js');
}

// Run the test
runGeminiTest().catch(console.error); 