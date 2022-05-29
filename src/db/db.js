const mongoose = require('mongoose');

async function dbrun () {
    try {
        await mongoose.connect('mongodb://localhost:27017/todoapp', {
            useNewUrlParser: true,
        });
        console.log('db connected!')
    } catch (error) {
        console.error(error.message);
    }
}

dbrun();