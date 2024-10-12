import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req) {
  const { session } = req.cookies;

  if (!session) {
    return new Response(
      JSON.stringify({ error: 'An error occurred while creating the user' }),
      { status: 401 }
    );
  }

  try {
    // Verifikasi token dari cookie
    const decoded = verify(session, process.env.JWT_SECRET);

    // Ambil data user berdasarkan userId dari token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({user}));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'User not found' }),
      { status: 401 }
    );
  }
}
