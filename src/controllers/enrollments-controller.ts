import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
<<<<<<< HEAD

  const cep = req.query.cep as string

  if(cep.length < 8){
    return res.sendStatus(httpStatus.NO_CONTENT)
  }
=======
  const { cep } = req.query as Record<string, string>;
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a

  try {
    const address = await enrollmentsService.getAddressFromCEP(cep);
    res.status(httpStatus.OK).send(address);
  } catch (error) {
    if (error.name === 'NotFoundError') {
<<<<<<< HEAD
      return res.sendStatus(httpStatus.NO_CONTENT);
=======
      return res.send(httpStatus.NO_CONTENT);
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
    }
  }
}
