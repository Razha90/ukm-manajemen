import Link from "next/link";
import styles from "./home.module.css";
import Image from "next/image";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import NameLogout from "./component/nameLogout";

async function getUserFromSession() {
  const cookieStore = cookies(); // Mengambil cookies dari header
  const sessionToken = cookieStore.get("session")?.value; // Mengambil session token

  if (!sessionToken) {
    return null; // Jika tidak ada session token, return null
  }

  // Cari session di database berdasarkan session token
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }, // Sertakan data user
  });

  if (!session) {
    return null; // Jika tidak ada session yang valid, return null
  }

  return session.user; // Return data user
}

export default async function Home() {


  const user = await getUserFromSession();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div>
            <Image src="/logo.png" alt="UKM Jaya" width={50} height={50} />
          </div>
          <Link href="/">
            <h1>UKM Jaya</h1>
          </Link>
        </div>
        <nav>
          <div className={styles.search}>
            <Link href="/app">Cari UKM</Link>
          </div>
          <div>
            {user ? (
              <NameLogout user={user} goUrl={'/'} />
            ) : (
              <Link href="/login" className={[styles.btnLogin]}>
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <Image
          src="/latar.jpg"
          width="1000"
          height="1000"
          alt="UKM Jaya"
          className={styles.latar}
        />
        <section className={styles.sec1}>
          <h2>UKM Jaya</h2>
          <p>
            Bergabung bersama kami para UKM dan jadilah bagian dari UKM Jaya.
          </p>
          <Link href="/app">Cari Penawaran UKM</Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <section className={styles.logofooter}>
          <div>
            <Image src="/logo.png" alt="UKM Jaya" width={30} height={30} />
          </div>
          <Link href="/">
            <h1>UKM Jaya</h1>
          </Link>
        </section>
        <section>
          <h2>Hubungi Kami</h2>
          <p>+6284 43434 343</p>
          <p>Jl. Raya Jaya No. 1, Jakarta, Indonesia</p>
        </section>
      </footer>
    </>
  );
}
