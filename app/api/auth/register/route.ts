import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../../utils/database';
;

export  async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
    return NextResponse.json({ message: 'Emailand password  are required' ,status:400});
   }
 try{
  
   // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' ,status:400});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id,email:email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token ,status:201});
  } 
  catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal Server Error' ,status:500});
  }
}
