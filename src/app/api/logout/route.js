import { parse } from 'cookie';
import prisma from '@/app/lib/prisma';

export async function POST(req) {
  const cookies = parse(req.headers.get('cookie') || '');
  const sessionToken = cookies.session;

  if (sessionToken) {
    // Hapus session dari database
    await prisma.session.delete({
      where: { sessionToken },
    });
  }

  // Hapus cookie session
  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'session=; Max-Age=0; Path=/;',
    },
  });
}
