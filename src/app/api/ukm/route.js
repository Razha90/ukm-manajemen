import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const ukms = await prisma.ukm.findMany();

    return NextResponse.json(ukms);
  } catch (error) {
    console.error('Error fetching UKMs:', error);
    return NextResponse.json({ message: 'Gagal mengambil daftar UKM' }, { status: 500 });
  }
}
