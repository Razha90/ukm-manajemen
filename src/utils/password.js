// utils/password.js
import bcrypt from 'bcrypt';

export const saltAndHashPassword = async (password) => {
  const saltRounds = 10; // Anda bisa menyesuaikan salt rounds sesuai kebutuhan
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
