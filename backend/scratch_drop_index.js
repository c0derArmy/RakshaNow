require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    try {
        const db = mongoose.connection.db;
        // Drop the non-sparse indices for phone and email if they exist
        try { await db.collection('users').dropIndex('phone_1'); } catch(e){}
        try { await db.collection('users').dropIndex('email_1'); } catch(e){}
        console.log("Dropped indices!");
    } catch(err) {
        console.error("FAIL:", err);
    }
    process.exit(0);
});
