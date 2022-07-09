const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
require('./db/db');
// route modules
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

// this help to serve static iamges.
app.use('/uploads', express.static('uploads'))
/* all of the routes */
app.use('/api/user/', userRoutes);
app.use('/api/', taskRoutes);


app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
