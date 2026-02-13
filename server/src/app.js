const express = require('express');
const pool = require('./config/db');
const apiLimiter = require('./middleware/rateLimiter');
const cors = require('cors');
const corsOptions = require('./middleware/corsOptions');
const notFound = require('./middleware/notFound');

const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(apiLimiter);

app.get('/health', (req, res) => {
   res.send('welcome to server backend');
});

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use('/api/users', authRoutes);

app.use(notFound);

module.exports = app;