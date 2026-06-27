require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const orderRouter = require('./router/orderRouter');

connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/orders', orderRouter);

//404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

//Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

//Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
