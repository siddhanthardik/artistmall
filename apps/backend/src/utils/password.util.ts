import crypto from 'crypto';

/**
 * Generates a secure random temporary password.
 */
export const generateTempPassword = (length = 12) => {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '0')
    .replace(/\//g, '1');
};
