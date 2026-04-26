import { faker } from '@faker-js/faker';

export const DEFAULT_ORGANIZATION = 'Ilan Lieberman';
export const DEFAULT_TITLE = 'Mr.';

export type SignUpStepOneData = {
  organization: string;
  title: string;
  legalFirstName: string;
  legalLastName: string;
  email: string;
  phoneNumber: string;
};

export type SignUpStepTwoData = {
  gender: string;
  day: string;
  month: string;
  year: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type SignUpFormData = {
  stepOne: SignUpStepOneData;
  stepTwo: SignUpStepTwoData;
};

function createGender(): string {
  return faker.helpers.arrayElement(['Male', 'Female']);
}

export function createStepOneData(overrides: Partial<SignUpStepOneData> = {}): SignUpStepOneData {
  return {
    organization: DEFAULT_ORGANIZATION,
    title: DEFAULT_TITLE,
    legalFirstName: faker.person.firstName(),
    legalLastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.string.numeric(11),
    ...overrides,
  };
}

export function createStepTwoData(overrides: Partial<SignUpStepTwoData> = {}): SignUpStepTwoData {
  const password = overrides.password ?? 'ScriptAssist123!';
  const dob = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  return {
    gender: createGender(),
    day: String(dob.getDate()).padStart(2, '0'),
    month: dob.toLocaleString('en-GB', { month: 'short' }), // e.g. 'Apr'
    year: String(dob.getFullYear()),
    password,
    confirmPassword: overrides.confirmPassword ?? password,
    acceptTerms: true,
    ...overrides,
  };
}

export function createSignUpData(overrides: Partial<SignUpFormData> = {}): SignUpFormData {
  return {
    stepOne: createStepOneData(overrides.stepOne),
    stepTwo: createStepTwoData(overrides.stepTwo),
  };
}
