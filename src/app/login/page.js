"use client";
import Link from 'next/link'
import styles from './login.module.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();

  const goBackOrHome = () => {
    if (document.referrer !== "") {
      router.back();
    } else {
      router.push('/');
    }
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    console.log(result);
    if (res.ok) {
      window.location.href = "/";
    } else {
      alert(result.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className={styles.background}>
      <form onSubmit={handleSubmit}>
        <div className={styles.back} onClick={goBackOrHome}>
             <Image src="/down.png" alt="Logo" width={18} height={18} /> 
             <p>Kembali</p>
        </div>
        <h2>Masuk</h2>
        <div>
          <label htmlFor="email">Masukkan Email</label> <br />
          <input id="email" type="email" required placeholder="example@email.com" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="password">Masukkan Password</label> <br />
          <input type="password" placeholder="Password" name="password" onChange={handleChange} value={formData.password} />
        </div>
        <Link href="/signup">Daftar akun baru!</Link>
        <button type="submit">Login</button> 
      </form>
    </div>
  )
}