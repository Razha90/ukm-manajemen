import { useState } from "react";

export default function TambahkanUKM() {
  const [selectedFile, setSelectedFile] = useState(null); // Menyimpan file gambar
  const [preview, setPreview] = useState(null); // Menyimpan URL pratinjau gambar
  const [name, setName] = useState(""); // Menyimpan nama UKM
  const [post, setPos] = useState(""); // Menyimpan post UKM

  // Event handler untuk menangani perubahan input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const filePreviewUrl = URL.createObjectURL(file); // Membuat URL sementara untuk pratinjau gambar
      setPreview(filePreviewUrl); // Menyimpan URL di state
    }
  };

  // Event handler untuk menangani submit form
  const handleTambahkanUKM = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    if (!selectedFile || !name) {
      alert("Harap isi nama UKM dan pilih file avatar");
      return;
    }

    // Membuat form data untuk mengirim gambar dan nama UKM
    const formData = new FormData();
    formData.append("avatar", selectedFile); // Menambahkan file gambar
    formData.append("name", name);
    formData.append('post', post) // Menambahkan nama UKM

    try {
      // Mengirim data menggunakan POST request
      const response = await fetch("/api/addukm", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("UKM berhasil ditambahkan!");
        setPreview(null);
        setName("");
        setPos("");
        setSelectedFile(null);
      } else {
        console.error("Gagal upload:", response.statusText);
        alert("Terjadi kesalahan saat upload gambar");
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    }
  };

  return (
    <div>
      <h2>Menambahkan UKM Baru</h2>
      <form onSubmit={handleTambahkanUKM}>
        <div>
          <label htmlFor="name">Nama UKM</label> <br />
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Menyimpan nama UKM
          />
        </div>
        {/* Pratinjau gambar */}
        {preview && (
          <div>
            <h3>Pratinjau Avatar</h3>
            <img src={preview} alt="Avatar Preview" width={150} height={150} />
          </div>
        )}
        <div>
          <label htmlFor="avatar">Profile</label> <br />
          <input
            id="avatar"
            type="file"
            name="avatar"
            onChange={handleFileChange}
          />
        </div>
        <br />
        <div>
          <label htmlFor="post">Tambahkan Post</label> <br />
          <textarea id="post" name="post" rows="4" cols="50" value={post} onChange={(e) => setPos(e.target.value)}></textarea>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
