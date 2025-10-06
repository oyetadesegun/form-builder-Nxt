import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcrypt';
import z from "zod";
import { prisma } from "@/lib/prisma";

const userSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  names: z.string().min(1, 'name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().min(1, 'phone number is required').max(16, 'phone number can not be this long'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
});

export async function GET() {
  try {
    const getUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        names: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });
    return NextResponse.json(getUsers);
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, names, email, phone, password } = userSchema.parse(body);

    // Check if email, username or phone already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email }
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username }
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: 'This username already exists' },
        { status: 409 }
      );
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone: phone }
    });
    if (existingUserByPhone) {
      return NextResponse.json(
        { user: null, message: 'This phone number already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10); // Increased salt rounds to 10

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        names,
        phone,
        email,
        password: hashedPassword
      }
    });

    // Remove password from response
    const { password: newUserPassword, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User Created' },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}