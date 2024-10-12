import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Ambil body dari request
    const body = await request.json();
    const { ukmId } = body;

    // Validasi input ukmId
    if (!ukmId) {
      return NextResponse.json({ message: 'ukmId diperlukan' }, { status: 400 });
    }

    // Mencari event berdasarkan ukmId
    const events = await prisma.event.findMany({
      where: {
        ukmId: parseInt(ukmId), // Pastikan ukmId berupa integer
      },
      include: {
        ukm: true, // Sertakan data UKM yang terkait
      },
    });

    if (events.length === 0) {
      // Mengembalikan pesan khusus jika data kosong
      return sendResponse({ message: 'Tidak ada event ditemukan untuk ukmId ini' }, 404);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Gagal mengambil data event' }, { status: 500 });
  }
}
