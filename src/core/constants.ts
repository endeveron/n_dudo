const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const STATE_KEY = process.env.NEXT_PUBLIC_STATE_KEY as string;

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;

const AUTH_SECRET = process.env.DB_CONNECTION_STRING as string;
const ENCRYPTION_PASSPHRASE = process.env.ENCRYPTION_PASSPHRASE as string;
const FIXED_SALT = process.env.FIXED_SALT as string;

const EMAIL_JWT = process.env.EMAIL_JWT as string;
const NODEMAILER_USER = process.env.NODEMAILER_USER as string;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD as string;

const DATE_FORMAT = 'dd MMM yyyy';

// LocalStorage keys
const LANG_CODE_KEY = 'langCode';
const REFERRAL_CODE_KEY = 'referralCode';
const EMAIL_CONFIRMED_KEY = 'emailConfirmed';

// Routes
const SIGNIN_REDIRECT = '/signin';
const SIGNUP_REDIRECT = '/signup';
// Default redirect path after user signed in.
const DEFAULT_REDIRECT = '/games';

export {
  API_URL,
  BASE_URL,
  STATE_KEY,
  DB_CONNECTION_STRING,
  DATE_FORMAT,
  AUTH_SECRET,
  ENCRYPTION_PASSPHRASE,
  FIXED_SALT,
  EMAIL_JWT,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  LANG_CODE_KEY,
  REFERRAL_CODE_KEY,
  EMAIL_CONFIRMED_KEY,
  SIGNIN_REDIRECT,
  SIGNUP_REDIRECT,
  DEFAULT_REDIRECT,
};
