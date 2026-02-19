import jwt from 'jsonwebtoken';

  const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpire });
};
export default generateToken;