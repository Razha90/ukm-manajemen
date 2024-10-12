import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Mengambil data dari FormData
    const formData = await request.formData();
    const name = formData.get('name');
    const avatar = formData.get('avatar');
    const post = formData.get('post') // File gambar avatar
    // Validasi input
    if (!name || !avatar || !post) {
      return NextResponse.json({ message: 'Nama UKM dan avatar diperlukan' }, { status: 400 });
    }

    // Konversi file avatar menjadi buffer
    const avatarBuffer = Buffer.from(await avatar.arrayBuffer());

    // Simpan data UKM dan gambar langsung ke database
    const newUkm = await prisma.ukm.create({
      data: {
        name,
        avatar: avatarBuffer,
        "post":post
      },
    });

    return NextResponse.json({
      message: 'UKM berhasil ditambahkan',
      ukm: newUkm,
    });

  } catch (error) {
    console.error('Error saat upload:', error);
    return NextResponse.json({ message: 'Gagal menambahkan UKM' }, { status: 500 });
  }
}
