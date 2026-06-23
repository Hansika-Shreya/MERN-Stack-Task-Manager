const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running! 🚀');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err));
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});