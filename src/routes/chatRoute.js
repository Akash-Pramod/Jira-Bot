import express from 'express';
import { askGeneralQuestion } from '../controllers/chatContoller.js';

const router = express.Router();

router.post('/ask', askGeneralQuestion);

export default router;