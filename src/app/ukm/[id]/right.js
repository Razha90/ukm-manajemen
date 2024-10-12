"use client";

import { useEffect, useState } from "react";
import styles from "./right.module.css";
import { useParams } from "next/navigation";

export default function ScreenRight() {
  const [event, setEvent] = useState(null);
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState(null);

  const fetchApi = async () => {
    try {
      const res = await fetch(`/api/ukm/${id}`);
      if (!res.ok) {
        const errorMessage = `Error: ${res.status} - ${res.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await res.json();
      setData(data);
      getData(data.id);
    } catch (error) {
      console.error("Fetch API error:", error);
      alert("Gagal mengambil data UKM");
    }
  };

  const getData = async (id) => {
    const response = await fetch("/api/getevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "ukmId":id }),
    });

    const result = await response.json();
    if (response.ok) {
      setEvent(result);
      console.log("Berhasil mengambil data EVENT", result);
    } else {
      setEvent(null);
      console.error("Error fetching EVENT", result.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);
  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const options = {
      year: "numeric",
      month: "long", // 'short' untuk singkatan
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Gunakan false untuk format 24 jam
    };

    return date.toLocaleString("id-ID", options);
  }

  return (
    <div className={styles.wrapper}>
      {event ? <h2>Jadwal Kegiatan</h2> : <h2>Tidak Ada Kegiatan</h2>}
      {event &&
        event.map((item) => (
          <div key={item.id} className={styles.eventCard}>
            <h3 className={styles.title}>{item.name}</h3>
            <div className={styles.dateContainer}>
              <p className={styles.date}>{formatDate(item.start)}</p>
              <p className={styles.selesai}>Sampai Selesai</p>
              <p className={styles.date}>{formatDate(item.end)}</p>
            </div>
            <p className={styles.location}>
              <strong>Lokasi:</strong> {item.location}
            </p>
            <p className={styles.desc}>{item.description}</p>
          </div>
        ))}
    </div>
  );
}
