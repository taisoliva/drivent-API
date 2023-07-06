import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
<<<<<<< HEAD
import { createOrUpdateEnrollmentSchema } from '@/schemas';
=======
import { createEnrollmentSchema } from '@/schemas';
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a

const enrollmentsRouter = Router();

enrollmentsRouter
  .get('/cep', getAddressFromCEP)
  .all('/*', authenticateToken)
  .get('/', getEnrollmentByUser)
<<<<<<< HEAD
  .post('/', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment);
=======
  .post('/', validateBody(createEnrollmentSchema), postCreateOrUpdateEnrollment);
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a

export { enrollmentsRouter };
