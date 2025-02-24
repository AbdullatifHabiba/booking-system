import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticate = (token:any) => {

  console.log("token \n",token);
  if (!token) {
    throw new Error('Authentication token missing');
  }
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  console.log("decoded \n",decoded);
    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
};
