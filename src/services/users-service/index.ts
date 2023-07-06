import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import eventsService from '../events-service';
import { duplicatedEmailError } from './errors';
<<<<<<< HEAD
import { cannotEnrollBeforeStartDateError } from '@/errors';
import userRepository from '@/repositories/user-repository';
=======
import userRepository from '@/repositories/user-repository';
import { cannotEnrollBeforeStartDateError } from '@/errors';
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function canEnrollOrFail() {
  const canEnroll = await eventsService.isCurrentEventActive();
  if (!canEnroll) {
    throw cannotEnrollBeforeStartDateError();
  }
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

const userService = {
  createUser,
};

export * from './errors';
export default userService;
