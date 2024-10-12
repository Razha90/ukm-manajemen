import prisma from '@/app/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Mencari data UKM berdasarkan ID
    const ukm = await prisma.ukm.findUnique({
      where: {
        id: parseInt(id), // Konversi ID menjadi integer
      },
    });

    // Jika UKM tidak ditemukan, kembalikan respon 404
    if (!ukm) {
      return NextResponse.json({ message: 'UKM tidak ditemukan' }, { status: 404 });
    }

    // Jika UKM ditemukan, kembalikan data dalam format JSON
    return NextResponse.json(ukm);
  } catch (error) {
    console.error('Error fetching UKM by ID:', error);
    return NextResponse.json({ message: 'Gagal mengambil data UKM' }, { status: 500 });
  }
}
