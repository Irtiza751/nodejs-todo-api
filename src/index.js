const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db/db');
// route modules
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const auth = require('./middlewares/auth');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

// this help to serve static iamges.
app.use('/profiles', auth, express.static('avatars'))
/* all of the routes */
app.use('/api/user/', userRoutes);
app.use('/api/', taskRoutes);
// root route.
app.get('/', (req, res) => res.send('Welcome todo api'));

// file upload test route.
app.get('/user', async (req, res) => {
  const user = await User.findById('62d3eac5302c0cc209471865');
  res.send(user);
});


app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
