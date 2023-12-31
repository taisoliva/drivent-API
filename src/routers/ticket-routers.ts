import { Router } from 'express';
import { createTicket, getTicketByUser, getTicketType } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticktesRouter = Router();

ticktesRouter
  .all('/*', authenticateToken)
  .post('/', createTicket)
  .get('/types', getTicketType)
  .get('/', getTicketByUser);

export { ticktesRouter };
