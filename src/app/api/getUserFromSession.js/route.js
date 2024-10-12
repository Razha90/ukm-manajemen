import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    // Parsing body dari request
    const body = await req.json();
    const { sessionToken } = body;

    // Cek jika ada field yang kosong
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: sessionToken' }),
        { status: 400 }
      );
    }

    // Cari session berdasarkan sessionToken
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }, // Sertakan data user dalam hasil query
    });

    // Jika session tidak ditemukan atau tidak valid
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 401 }
      );
    }

    // Ambil data user dari session
    const user = session.user;


    // Response dengan data user
    return new Response(
      JSON.stringify({
        message: 'Session valid',
        user: { id: user.id, email: user.email, name: user.name }, // Mengembalikan data user
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error during session validation:', error);

    return new Response(
      JSON.stringify({ error: 'An error occurred during session validation' }),
      { status: 500 }
    );
  }
}
