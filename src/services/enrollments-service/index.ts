import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
<<<<<<< HEAD
import { ViaCEPAddress } from '@/protocols';

async function getAddressFromCEP(cep : string) {

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`) ;

  if (result.data.erro) {
    throw notFoundError();
  }

  const address: ViaCEPAddress = {
    logradouro: result.data.logradouro,
    complemento:result.data.complemento,
    bairro:result.data.bairro,
    cidade:result.data.localidade,
    uf:result.data.uf
  }
=======
import { AddressEnrollment } from '@/protocols';

async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) {
    throw notFoundError();
  }

  const { bairro, localidade, uf, complemento, logradouro } = result.data;

  const address: AddressEnrollment = {
    bairro,
    cidade: localidade,
    uf,
    complemento,
    logradouro,
  };

>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a
  return address;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
<<<<<<< HEAD
  
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep)

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.
=======
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep);
>>>>>>> 16c5480c3d328c63006f5f18b3b42aa9a36b220a

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
