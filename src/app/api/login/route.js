import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export async function POST(req) {
  try {
    // Parsing body dari request
    const body = await req.json();
    const { email, password } = body;

    // Cek jika ada field yang kosong
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password' }),
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Buat JWT session token
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
      secure: true,
      maxAge: 86400, 
      path: '/',
    });

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': setCookie, // Set cookie pada header response
        }
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);

    return new Response(
      JSON.stringify({ error: 'An error occurred during login' }),
      { status: 500 }
    );
  }
}
