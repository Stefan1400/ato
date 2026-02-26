require('dotenv').config();
const express = require('express');
const apiLimiter = require('./middleware/rateLimiter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./middleware/corsOptions');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(apiLimiter);

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(cookieParser());

app.use('/api/users', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;