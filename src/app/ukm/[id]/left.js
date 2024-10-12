"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./left.module.css";
import Image from "next/image";

export default function ScreenLeft(userId) {
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState(null);
  const [join, setJoin] = useState(null);
  const fetchApi = async () => {
    try {
      const res = await fetch(`/api/ukm/${id}`);
      if (!res.ok) {
        const errorMessage = `Error: ${res.status} - ${res.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await res.json();
      setData(data);
      getJoin(userId.user, data.id);
    } catch (error) {
      console.error("Fetch API error:", error);
      alert("Gagal mengambil data UKM");
    }
  };

  useEffect(() => {
    fetchApi();
    getJoin();
  }, []);

  const createUserUkm = async (userId, ukmId) => {
    // Ganti dengan ID UKM yang valid
    if (!userId || !ukmId) {
      alert("Anda harus login terlebih dahulu");
      window.location.href = "/login";
    }
    const response = await fetch("/api/adduserukm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ukmId }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("UserUkm created:", data);
      getJoin(userId, ukmId);
      alert("Berhasil bergabung dengan UKM");
    } else {
      console.error("Error creating UserUkm:", data.message);
      alert("Gagal bergabung dengan UKM");
    }
  };

  const getJoin = async (user,ukm) => {
    const response = await fetch('/api/getuserukm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "userId":user , "ukmId":ukm }),
    });
    
    const result = await response.json();
    if (response.ok) {
      setJoin(result);
    } else {
      console.error('Error fetching UserUkm:', result.message);
    }
    console.log(result);
    
  };

  const backButton = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.back} onClick={backButton}>
        &lt;
        <p>Kembali</p>
      </div>
      {data ? (
        <>
          <h1>{data.name}</h1>
          <div className={styles.wrapImg}>
            <Image
              src={`data:image/jpeg;base64,${Buffer.from(data.avatar).toString(
                "base64"
              )}`}
              alt={data.name}
              width={1000}
              height={1000}
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: data.post }} />
          {!join ? (
            <div className={styles.button}>
              <button onClick={() => createUserUkm(userId.user, data.id)}>
                Bergabung Bersama {data.name}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <h1>Maaf silahkan menunggu......</h1>
      )}
    </div>
  );
}
