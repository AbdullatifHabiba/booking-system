import { NextResponse ,NextRequest} from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../utils/database';
;

export  async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required'} ,{status:400});
   }

   // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email'} ,{status:400});
    }
  // validate password
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' },{status:400});
    }
      
 try{
  
   // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists'} ,{status:400});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

   
// regiser zoom token for the user

    return NextResponse.json({ user },{status:201});
  } 
  catch (error) {
    //console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal Server Error' },{status:500});
  }
}
