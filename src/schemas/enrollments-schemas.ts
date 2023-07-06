<<<<<<< HEAD
import Joi from 'joi';
import { getStates, isValidCEP, isValidCPF, isValidMobilePhone } from '@brazilian-utils/brazilian-utils';
=======
import { getStates, isValidCEP, isValidCPF, isValidMobilePhone } from '@brazilian-utils/brazilian-utils';
import Joi from 'joi';
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
import { CreateOrUpdateEnrollmentWithAddress } from '@/services/enrollments-service';

const cpfValidationSchema = Joi.string().length(11).custom(joiCpfValidation).required();

const cepValidationSchema = Joi.string().length(9).custom(JoiCepValidation).required();

const mobilePhoneValidationSchema = Joi.string().min(14).max(15).custom(joiMobilePhoneValidation).required();

<<<<<<< HEAD
export const createOrUpdateEnrollmentSchema = Joi.object<CreateOrUpdateEnrollmentWithAddress>({
=======
export const createEnrollmentSchema = Joi.object<CreateOrUpdateEnrollmentWithAddress>({
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
  name: Joi.string().min(3).required(),
  cpf: cpfValidationSchema,
  birthday: Joi.string().isoDate().required(),
  phone: mobilePhoneValidationSchema,
  address: Joi.object({
    cep: cepValidationSchema,
    street: Joi.string().required(),
    city: Joi.string().required(),
    number: Joi.string().required(),
    state: Joi.string()
      .length(2)
      .valid(...getStates().map((s) => s.code))
      .required(),
    neighborhood: Joi.string().required(),
    addressDetail: Joi.string().allow(null, ''),
  }).required(),
});

function joiCpfValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidCPF(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}

function JoiCepValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidCEP(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}

function joiMobilePhoneValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidMobilePhone(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}
