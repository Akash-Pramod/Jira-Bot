import express from 'express';
import { createTicketFromPrompt } from '../controllers/ticketController.js';

const router = express.Router();

// POST /api/v1/create-ticket
router.post('/create-ticket', createTicketFromPrompt);

export default router;
