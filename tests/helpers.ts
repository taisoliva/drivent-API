import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { createUser } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';

export async function cleanDb() {
  await prisma.address.deleteMany({});
<<<<<<< HEAD
=======
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
<<<<<<< HEAD
=======
  await prisma.ticketType.deleteMany({});
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
