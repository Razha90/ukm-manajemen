import { NextResponse } from "next/server";
import { parse } from "cookie";

export async function middleware(req) {
  // Dapatkan cookie dari request
  const cookies = parse(req.headers.get("cookie") || "");
  const sessionToken = cookies.session;
  console.log(sessionToken);
  // Jika tidak ada session token, lanjutkan request
  // return NextResponse.next();

  if (!sessionToken) {
    return NextResponse.next();
  }
  

  // // Periksa apakah session token valid di database
  // const session = await prisma.session.findUnique({
  //   where: { sessionToken:sessionToken },
  // });

  // Jika session ditemukan, redirect ke halaman dashboard
  return NextResponse.redirect(new URL("/", req.url));

}

// Tentukan halaman mana saja yang akan menggunakan middleware ini
export const config = {
  matcher: ["/login", "/signup"],
};
