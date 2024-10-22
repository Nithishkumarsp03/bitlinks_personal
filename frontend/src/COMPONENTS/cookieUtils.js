// cookieUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // Ensure this key is kept secure and consistent

export const encrypt = (text) => {
  if (text) {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  }
  return '';
};

 export const decrypt = (ciphertext) => {
  if (ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return '';
};
