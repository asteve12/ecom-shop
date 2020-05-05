type TValidationFunction = (value: string) => boolean | string;

const doesOnlyContainsDigits = (value: string): boolean => {
  const parsedValue = parseInt(value, 10);
  const onlyDigitals: RegExp = /^\d+$/;

  return (!!value.match(onlyDigitals) && !Number.isNaN(parsedValue) && typeof parsedValue === 'number');
};

const getOnlyDigitsCheckResult: TValidationFunction = (value) => doesOnlyContainsDigits(value) || 'Should only contain digits';
const getValueWithoutSpaces = (value: string): string => value.split(' ').join('');

export const required: TValidationFunction = (value) => {
  if (value.length === 0) return 'Can\'t be empty';
  return true;
};

export const phone: TValidationFunction = (value) => {
  const valueWithoutSpaces = getValueWithoutSpaces(value);
  if (valueWithoutSpaces.length < 5) return 'Phone number is too short';
  return getOnlyDigitsCheckResult(valueWithoutSpaces);
};

export const dateExpiration: TValidationFunction = (value) => {
  const valueWithoutSpaces = getValueWithoutSpaces(value);
  if (valueWithoutSpaces.length !== 2) return 'Should contain 2 digits';
  return getOnlyDigitsCheckResult(valueWithoutSpaces);
};

export const cvv: TValidationFunction = (value) => {
  const valueWithoutSpaces = getValueWithoutSpaces(value);
  if (valueWithoutSpaces.length !== 3) return 'Should contain 3 digits';
  return getOnlyDigitsCheckResult(valueWithoutSpaces);
};

export const email: TValidationFunction = (value) => required(value);

export const cardNumber: TValidationFunction = (value) => {
  const valueWithoutSpaces = getValueWithoutSpaces(value);
  if (valueWithoutSpaces.length === 0) return 'Can\'t be empty';
  if (valueWithoutSpaces.length < 16) return 'Number is too short';
  if (valueWithoutSpaces.length > 16) return 'Number is too long';

  return getOnlyDigitsCheckResult(valueWithoutSpaces);
};
