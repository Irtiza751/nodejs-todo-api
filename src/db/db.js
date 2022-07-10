const mongoose = require('mongoose');

async function dbrun () {
    try {
        await mongoose.connect(process.env.db_connection, {
            useNewUrlParser: true,
        });
        console.log('db connected!')
    } catch (error) {
        console.error(error.message);
    }
}

dbrun();