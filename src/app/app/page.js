import prisma from "../lib/prisma";
import { cookies } from "next/headers";
import Home from "./home"; // Import komponen client

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session")?.value;

  let user = null;

  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (session) {
      user = session.user; // Ambil user dari session
    }
  }

  // Kirim user ke komponen client Home
  return <Home user={user} />;
}
