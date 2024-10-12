"use client";
import styles from "./logout.module.css";
import Image from "next/image";

export default function NameLogout({user, goUrl}) {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = goUrl;
      } else {
        alert("Failed to logout");
      }
    } catch (error) {
      alert("Failed to logout");
    }
  };
  return (
    <div className={styles.navbar}>
      <div className={styles.userSection}>
        <p>Hay, {user.name}</p>
        <Image src="/down.png" alt="Logo" width={18} height={18} />
        <div className={styles.dropdownMenu}>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
