export const isPasswordLengthValid = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength;
};
