import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;
export function connectDb(): void {
<<<<<<< HEAD
  if (prisma) {
    return;
  }

=======
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
  prisma = new PrismaClient();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}
