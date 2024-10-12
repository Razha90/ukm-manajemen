import { useEffect, useState } from "react";
import styles from "./ukmprofile.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UKMPage() {
  const [ukms, setUkms] = useState([]);
  const router = useRouter();
  const fetchUkms = async () => {
    try {
      const response = await fetch("/api/ukm");
      if (!response.ok) {
        throw new Error("Gagal mengambil daftar UKM");
      }
      const data = await response.json();
      setUkms(data);
    } catch (error) {
      console.error("Error fetching UKMs:", error);
      alert("Gagal mengambil daftar UKM");
    }
  };

  useEffect(() => {
    fetchUkms();
  }, []);

  const handlePush = (id) => {
    router.push(`/ukm/${id}`);
  };
  return (
    <div className={styles.wrapper}>
      <h1>Profile UKM</h1>
      <div className={styles.cardWrap}>
        {ukms &&
          ukms.map((ukm) => (
            <>
              <div className={styles.card} onClick={() => handlePush(ukm.id)}>
                <div className={styles.cardImg}>
                  <Image
                    src={`data:image/jpeg;base64,${Buffer.from(
                      ukm.avatar
                    ).toString("base64")}`}
                    alt={ukm.name}
                    width={1000}
                    height={1000}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h2>{ukm.name}</h2>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
