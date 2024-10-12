// app/ukm/[id]/page.js
import { cookies } from "next/headers";
import ScreenLeft from "./left";
import styles from "./ukm.module.css";
import prisma from "@/app/lib/prisma";
import ScreenRight from "./right";

export default async function UkmPage() {
  const cookieStore = cookies(); // Mengambil cookies dari header
  const sessionToken = cookieStore.get("session")?.value; 
  if (!sessionToken) {
    return null; // Jika tidak ada session token, return null
  }

  // Cari session di database berdasarkan session token
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }, // Sertakan data user
  });


  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        {session ? <ScreenLeft user={session.user.id} /> : null}
      </div>
      <div className={styles.right}>
        <ScreenRight />
      </div>
    </div>
  );
}
