import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'BadRequestError',
    message: 'the server cannot or will not process the request due!',
  };
}