require('dotenv').config();
const express  = require('express');
const connectDB = require('./config/db');
const orderRouter = require('./router/orderRouter');

connectDB(); 

const app = express();
const PORT = process.env.PORT || 27017;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

app.use(notFound);
app.use(errorHandler);