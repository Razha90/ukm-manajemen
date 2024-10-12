import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Mengambil data dari FormData
    const formData = await request.formData();
    const id = formData.get("id"); // Mengambil ID untuk operasi edit
    const name = formData.get("name");
    const avatar = formData.get("avatar");
    const post = formData.get("post"); // Mengambil post

    // Validasi input
    if (!name || !avatar || !post) {
      return NextResponse.json(
        { message: "Nama UKM, avatar, dan post diperlukan" },
        { status: 400 }
      );
    }

    let avatarBuffer;
    let updatedUkm;

    if (typeof avatar === "string") {
      updatedUkm = await prisma.ukm.update({
        where: { id: parseInt(id) },
        data: {
          name,
          post,
        },
      });
    } else {
      console.log("kontol");
      avatarBuffer = Buffer.from(await avatar.arrayBuffer());
      updatedUkm = await prisma.ukm.update({
        where: { id: parseInt(id) },
        data: {
          name,
          avatar: avatarBuffer,
          post,
        },
      });
    }

    return NextResponse.json({
      message: "UKM berhasil diperbarui",
      ukm: updatedUkm,
    });
  } catch (error) {
    console.error("Error saat mengunggah:", error);
    return NextResponse.json(
      { message: "Gagal memproses UKM" },
      { status: 500 }
    );
  }
}
