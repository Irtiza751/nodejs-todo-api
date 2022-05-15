const express = require('express');
const morgan = require('morgan');
require('./db/db');

// route modules
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

/* all of the routes */
app.use('/api/user/', userRoutes);

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));