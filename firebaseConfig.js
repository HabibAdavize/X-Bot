const admin = require('firebase-admin');

let db = null;

try {
    // Try to load the service account key
    const serviceAccount = require('./serviceAccountKey.json');
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.log('⚠️ Firebase not configured - running without database');
    console.log('💡 To enable Firebase, add serviceAccountKey.json to your project');
    
    // Create a mock database object
    db = {
        collection: (name) => ({
            add: async (data) => {
                console.log(`📝 Would save to ${name}:`, data);
                return { id: 'mock-id' };
            }
        })
    };
}

module.exports = db;
