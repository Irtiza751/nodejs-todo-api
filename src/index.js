const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
require('./db/db');
// route modules
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const auth = require('./middlewares/auth');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

// this help to serve static iamges.
app.use('/profiles', auth, express.static('avatars'))
/* all of the routes */
app.use('/api/user/', userRoutes);
app.use('/api/', taskRoutes);
// root route.
app.get('/', (req, res) => res.send('Welcome todo api'));


app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
