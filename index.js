import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

// Import your routes
import geminiRoute from './src/routes/geminiRoute.js';
import chatRoute from './src/routes/chatRoute.js';

const app = express();

app.use(express.json());

app.use('/api/v1', geminiRoute);
app.use('/api/v1', chatRoute);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
