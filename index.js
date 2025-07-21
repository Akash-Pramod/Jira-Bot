import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

// Import your routes
import geminiRoute from './src/routes/geminiRoute.js';
import chatRoute from './src/routes/chatRoute.js';
import ticketRoute from './src/routes/ticketRoute.js';

const app = express();

app.use(express.json());

app.use('/api/v1', geminiRoute);
app.use('/api/v1', chatRoute);
app.use('/api/v1', ticketRoute);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
