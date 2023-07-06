<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
=======
import { NextFunction, Request, Response } from 'express';
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function handleApplicationErrors(
  err: ApplicationError | Error,
  _req: Request,
  res: Response,
<<<<<<< HEAD
  next: NextFunction,
=======
  _next: NextFunction,
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
) {
  if (err.name === 'CannotEnrollBeforeStartDateError') {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
    });
  }

  if (err.name === 'ConflictError' || err.name === 'DuplicatedEmailError') {
    return res.status(httpStatus.CONFLICT).send({
      message: err.message,
    });
  }

  if (err.name === 'InvalidCredentialsError') {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message,
    });
  }

<<<<<<< HEAD
=======
  if (err.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message,
    });
  }

>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
  if (err.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  /* eslint-disable-next-line no-console */
  console.error(err.name);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
