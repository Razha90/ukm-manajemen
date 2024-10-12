import { useEffect, useState } from "react";
import styles from "./present.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PresentUKM({ userId }) {
  const [data, setData] = useState([]); // Inisialisasi sebagai array kosong
  const router = useRouter();
  const getJoin = async () => {
    const response = await fetch("/api/getukm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }),
    });

    const result = await response.json();
    if (response.ok) {
      setData(result);
      console.log("Berhasil mengambil data UKM", result);
    } else {
      console.error("Error fetching UserUkm:", result.message);
    }
  };

  const handlePush = (id) => {
    router.push(`/ukm/${id}`);
  }

  useEffect(() => {
    getJoin();
  }, []); // Tambahkan userId sebagai dependency untuk memanggil ulang saat userId berubah

  return (
    <div className={styles.wrapper}>
      <h1>UKM Terdaftar</h1>
      {data ? (
        data.length > 0 ? ( // Periksa apakah data adalah array dan memiliki elemen
          <div className={styles.cardWrap}>
            {data.map((item) => (
              <div key={item.id} className={styles.ukmCard} onClick={() => handlePush(item.ukm.id)}>
                <Image
                  src={`data:image/jpeg;base64,${Buffer.from(
                    item.ukm.avatar
                  ).toString("base64")}`}
                  alt={item.name}
                  className={styles.avatar}
                  width={1000}
                  height={1000}
                />
                <h3 className={styles.title}>{item.ukm.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <h2>Belum Bergabung dengan UKM</h2>
        )
      ) : (
        <h2>Silahkan Login Terlebih Dahulu</h2>
      )}
    </div>
  );
}
