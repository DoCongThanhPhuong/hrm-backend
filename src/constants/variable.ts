export const API_PREFIX = 'api';
export const API_VERSION = 'v1';
export const PASSWORD_REGEX =
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~`¿¡!#$%^&*€£@+÷=\\-[\\]\';,/{}()|":<>?._])[A-Za-z\\d~`¿¡!#$%^&*€£@+÷=\\-[\\]\';,/{}()|":<>?._]{8,20}$';
export const PHONE_REGEX = '^(?:\\+)?\\d{10,12}$';
export const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const NUMBER = '0123456789';
export const SPECIAL_CHARACTERS = '!#$%&()*+,-./:;<=>?@[]^_{|}~';
export const PASSWORD_CHARACTERS = `${LETTERS}${NUMBER}${SPECIAL_CHARACTERS}`;
export const SHARING_KEY_CHARACTERS = `${LETTERS}${NUMBER}`;

// Cache key prefix
export const FORM_CACHE_PREFIX = 'FORM_';
export const USER_CACHE_PREFIX = 'USER_';
export const ROLE_CACHE_PREFIX = 'ROLE_';
export const FORGOT_PASSWORD_PREFIX = 'FORGOT_PASSWORD_USER_';
