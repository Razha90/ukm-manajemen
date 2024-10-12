import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Mengambil data dari body permintaan
    const { userId, ukmId } = await request.json();

    // Validasi input
    if (!userId || !ukmId) {
      return NextResponse.json({ message: 'userId dan ukmId diperlukan' }, { status: 400 });
    }

    // Mengambil data userUkm berdasarkan userId dan ukmId
    const userUkm = await prisma.userUkm.findFirst({
      where: {
        userId: parseInt(userId),
        ukmId: parseInt(ukmId),
      },
      include: {
        ukm: true,
      },
    });

    // Cek apakah data ditemukan
    if (!userUkm) {
      return NextResponse.json({ message: 'UserUkm tidak ditemukan' }, { status: 404 });
    }

    // Mengembalikan data userUkm yang ditemukan
    return NextResponse.json(userUkm);
  } catch (error) {
    console.error('Error fetching UserUkm:', error);
    return NextResponse.json({ message: 'Gagal mengambil data UserUkm' }, { status: 500 });
  }
}
