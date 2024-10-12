"use client";
import Image from "next/image";
import styles from "./signup.module.css";
import { useState } from "react";

export default function Home() {
  const goBackOrHome = () => {
    if (document.referrer !== "") {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert(result.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.background}>
      <form onSubmit={handleSubmit}>
        <div className={styles.back} onClick={goBackOrHome}>
          <Image src="/down.png" alt="Logo" width={18} height={18} />
          <p>Kembali</p>
        </div>
        <h2>Daftar Akun Baru</h2>
        <div>
          <label htmlFor="email">Daftarkan Email Anda</label> <br />
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="example@exam.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Daftarkan Nama Anda</label> <br />
          <input
            id="name"
            type="text"
            name="name"
            required
            placeholder="David Hidayat"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Buat Password</label> <br />
          <input
            id="password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <br />
        <button type="submit">Daftar</button>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </div>
  );
}
