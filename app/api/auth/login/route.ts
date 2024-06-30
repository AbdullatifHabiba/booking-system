// ./app/api/auth/login.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../utils/database';


export async function POST(req: Request) {

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {

        email: email
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const token = jwt.sign({ userId: user.id, email: email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    // console.log('Error during login:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 },);
  }
}

// get user id

export async function GET(req: Request) {
  console.log(req);
  const body = await req.json();
  const { email } = body;
  console.log(email);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}
