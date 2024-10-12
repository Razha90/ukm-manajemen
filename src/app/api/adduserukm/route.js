// src/app/api/userukm/[id]/route.js
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// Validasi fungsi untuk memeriksa apakah nilai adalah angka dan tidak null
const validateUserUkmData = (userId, ukmId) => {
  if (typeof userId !== 'number' || isNaN(userId) || userId <= 0) {
    return { valid: false, message: 'userId harus berupa angka positif.' };
  }
  if (typeof ukmId !== 'number' || isNaN(ukmId) || ukmId <= 0) {
    return { valid: false, message: 'ukmId harus berupa angka positif.' };
  }
  return { valid: true };
}

// Menambahkan data UserUkm baru
export async function POST(request) {
 const body =  await request.json();
 const { userId, ukmId } = body;
  console.log('userId:', ukmId);

  // Validasi input
  const validation = validateUserUkmData(userId, ukmId);
  if (!validation.valid) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  try {
    const userUkm = await prisma.userUkm.create({
      data: {
        userId,
        ukmId,
      },
    });

    return NextResponse.json(userUkm, { status: 201 });
  } catch (error) {
    console.error('Error creating UserUkm:', error);
    return NextResponse.json({ message: 'Gagal menambahkan UserUkm' }, { status: 500 });
  }
}
