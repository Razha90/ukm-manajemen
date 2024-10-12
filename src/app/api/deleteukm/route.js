import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const ukm = await prisma.ukm.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: "UKM berhasil dihapus",
      ukm,
    });
  } catch (error) {
    console.error("Error saat menghapus:", error);
    return NextResponse.json(
      { message: "Gagal menghapus UKM" },
      { status: 500 }
    );
  }
}