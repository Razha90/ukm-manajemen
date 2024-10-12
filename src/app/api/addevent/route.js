import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Mengambil data dari FormData
    const formData = await request.formData();
    const name = formData.get('name');
    const start = formData.get('start'); // Tanggal dan waktu acara
    const end = formData.get('end'); // Tanggal dan waktu acara
    const location = formData.get('location');
    const description = formData.get('description');
    const ukmId = formData.get('ukmId'); // ID UKM
    console.log('data', ukmId);
    // Validasi input
    if (!name || !start || !end || !location || !ukmId) {
      return NextResponse.json({ message: 'Semua field kecuali deskripsi harus diisi' }, { status: 400 });
    }

    // Simpan data acara ke database
    const newEvent = await prisma.event.create({
      data: {
        name,
        start: new Date(start), // Mengkonversi string menjadi Date
        end: new Date(end),     // Mengkonversi string menjadi Date
        location,
        description, // Deskripsi bisa null
        ukmId: parseInt(ukmId), // Pastikan ukmId adalah integer
      },
    });

    return NextResponse.json({
      message: 'Event berhasil ditambahkan',
      event: newEvent,
    });

  } catch (error) {
    console.error('Error saat menambahkan event:', error);
    return NextResponse.json({ message: 'Gagal menambahkan event' }, { status: 500 });
  }
}
