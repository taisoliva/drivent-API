import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
<<<<<<< HEAD
  ticktesRouter,
=======
  ticketsRouter,
>>>>>>> 37ba8f70aa6076dc5099fa09f8c936fdb684f1c5
  paymentsRouter,
} from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
<<<<<<< HEAD
  .use('/tickets', ticktesRouter)
=======
  .use('/tickets', ticketsRouter)
>>>>>>> 37ba8f70aa6076dc5099fa09f8c936fdb684f1c5
  .use('/payments', paymentsRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
