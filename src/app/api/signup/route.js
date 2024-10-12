import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export async function POST(req) {
  try {
    // Parsing body dari request
    const body = await req.json();
    const { email, name, password } = body;

    // Cek jika ada field yang kosong
    if (!email || !name || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name, password' }),
        { status: 400 }
      );
    }

    // Cek apakah user dengan email yang diberikan sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email is already registered' }),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user:', { email, name, password: hashedPassword });
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    

    const sessionToken = sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Simpan session di database
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 86400000) // Sesi kedaluwarsa setelah 1 hari
      }
    });

    // Simpan token di cookie
    const setCookie = cookie.serialize('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Aktifkan secure cookie jika di production
      maxAge: 86400, // Sesi berlaku selama 1 hari
      path: '/',
    });

    return new Response(
      JSON.stringify({
        message: 'User created and logged in successfully',
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 201,
        headers: {
          'Set-Cookie': setCookie, // Set cookie pada header response
        }
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);

    return new Response(
      JSON.stringify({ error: 'An error occurred while creating the user' }),
      { status: 500 }
    );
  }
}
