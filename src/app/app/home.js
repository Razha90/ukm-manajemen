"use client";

import { useState } from "react";
import styles from "./app.module.css";
import Image from "next/image";
import NameLogout from "../component/nameLogout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dashboard from "./dashboard";
import UKMPage from "./ukmpage";
import PresentUKM from "./presentUKM";

export default function Home({ user }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const backToHome = () => {
    router.push("/");
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Image src="/logo.png" width={50} height={50} alt="logo" />
          <h2>UKM Jaya</h2>
        </div>
        <div className={styles.navigation}>
          <nav>
            <div
              className={currentPage == 1 ? styles.current : styles.nocurrent}
              onClick={() => setCurrentPage(1)}
            >
              UKM
            </div>

            <div
              className={currentPage == 2 ? styles.current : styles.nocurrent}
              onClick={() => setCurrentPage(2)}
            >
              UKM Terdaftar
            </div>
            {user && user.role === "ADMIN" ? (
              <div
                className={currentPage == 3 ? styles.current : styles.nocurrent}
                onClick={() => setCurrentPage(3)}
              >
                Dashboard
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.top}>
          <div className={styles.back} onClick={backToHome}>
            <Image src="/down.png" alt="Logo" width={18} height={18} />
            <p>Kembali</p>
          </div>
          {user ? (
            <NameLogout user={user} goUrl={"/app"} />
          ) : (
            <Link href="/login" className={[styles.btnLogin]}>
              Login
            </Link>
          )}
        </div>
        <div className={styles.bottom}>
          {currentPage === 1 ? (
            <>
              <UKMPage />
            </>
          ) : currentPage === 2 ? (
            <>
              <PresentUKM userId={user.id} />
            </>
          ) : (
            <>
              <Dashboard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
