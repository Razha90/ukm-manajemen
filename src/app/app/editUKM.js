import Image from "next/image";
import { useEffect, useState } from "react";

export default function EditUKM() {
  const [selectedUkm, setSelectedUkm] = useState(null);
  const [ukms, setUkms] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [event, setEvent] = useState({
    name: "",
    start: "",
    end: "",
    location: "",
    description: "",
    ukmId: "",
  });
  const [labelEdit, setLabelEdit] = useState(null);

  const fetchUkms = async () => {
    try {
      const response = await fetch("/api/ukm");
      if (!response.ok) {
        throw new Error("Gagal mengambil daftar UKM");
      }
      const data = await response.json();
      setUkms(data);
      setSelectedUkm(data[0]);
      setLabelEdit(data[0].id) // Atur UKM pertama sebagai pilihan default
    } catch (error) {
      console.error("Error fetching UKMs:", error);
      alert("Gagal mengambil daftar UKM");
    }
  };

  // Fetch data UKM pada saat komponen pertama kali di-mount
  useEffect(() => {
    fetchUkms();
  }, []); // Tidak ada dependensi, jadi ini hanya dijalankan sekali ketika komponen dimount

  // Fungsi untuk menangani perubahan pada pilihan edit
  const handleEdit = (event) => {
    const selectedId = event.target.value;
    const selected = ukms.find((ukm) => ukm.id === parseInt(selectedId));
    setSelectedUkm(selected);
  };

  // Fungsi untuk menangani perubahan avatar yang dipilih
  const handleSelectedEdit = (event) => {
    setPreview(URL.createObjectURL(event.target.files[0]));
    setSelectedAvatar(event.target.files[0]);
  };

  // Fungsi untuk submit form dan memperbarui UKM
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(selectedUkm.avatar);
    if (!selectedAvatar) {
      formData.append("avatar", selectedUkm.avatar);
    }

    try {
      const response = await fetch("/api/editukm", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("UKM berhasil diperbarui!");
        setPreview(null);
        setSelectedUkm(null);
        setSelectedAvatar(null);

        // Fetch ulang data UKM setelah berhasil diperbarui
        fetchUkms();
      } else {
        console.error("Gagal mengedit:", response.statusText);
        alert("Terjadi kesalahan saat mengedit UKM");
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    }
  };

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await fetch("/api/deleteukm", {
        method: "POST", // Menggunakan metode POST
        body: formData, // Mengirim ID sebagai payload
      });

      if (!response.ok) {
        throw new Error("Error saat menghapus data"); // Menghandle error jika response tidak OK
      }

      const result = await response.json(); // Mengambil respon dalam bentuk JSON
      console.log("Data berhasil dihapus:", result);
      fetchUkms(); // Memuat ulang data UKM setelah berhasil menghapus
      alert("Data berhasil dihapus"); // Menampilkan alert sukses
      // Lakukan tindakan lain setelah berhasil menghapus, seperti memperbarui UI
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Data gagal dihapus"); // Menangkap dan menampilkan error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEvent = async (e) => {
    e.preventDefault();

    // Ambil data dari form
    const formData = new FormData(e.target);
    formData.append("ukmId", labelEdit);

    // Validasi: Periksa apakah semua field yang diperlukan terisi
    const name = formData.get("name");
    const start = formData.get("start");
    const end = formData.get("end");
    const location = formData.get("location");
    const ukmId = formData.get("ukmId");

    // Menggunakan Array untuk menyimpan nama field yang kosong
    const emptyFields = [];

    if (!name) emptyFields.push("Nama");
    if (!start) emptyFields.push("Tanggal dan Waktu Mulai");
    if (!end) emptyFields.push("Tanggal dan Waktu Selesai");
    if (!location) emptyFields.push("Lokasi");
    if (!ukmId) emptyFields.push("ID UKM");

    if (emptyFields.length > 0) {
        alert(`Field berikut harus diisi: ${emptyFields.join(", ")}`);
        return;
    }

    try {
        const response = await fetch("/api/addevent", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Event berhasil ditambahkan!");
            setEvent({
                name: "",
                start: "",
                end: "",
                location: "",
                description: "",
                ukmId: "",
            });
            // Reset form atau lakukan tindakan lain jika perlu
        } else {
            console.error("Gagal menambahkan event:", response.statusText);
            alert("Terjadi kesalahan saat menambahkan event");
        }
    } catch (error) {
        console.error("Error saat submit event:", error);
        alert("Terjadi kesalahan, coba lagi nanti");
    }
};


  return (
    <div>
      <h2>Edit UKM</h2>
      <div>
        <label for="ukmSelect">Pilih UKM:</label>
        <select id="ukmSelect" name="ukm" onChange={handleEdit}>
          {ukms?.length > 0 ? (
            ukms.map((ukm) => (
              <option key={ukm.id} value={ukm.id}>
                {ukm.name}
              </option>
            ))
          ) : (
            <option value="">Tidak ada UKM tersedia</option>
          )}
        </select>
        <button type="button" onClick={() => fetchUkms()}>
          Refresh
        </button>
        <form onSubmit={handleSubmit}>
          {selectedUkm ? (
            <>
              <input type="hidden" name="id" value={selectedUkm.id} />
              <div>
                <label htmlFor="name">Nama UKM</label> <br />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={selectedUkm.name}
                />
              </div>
              <div>
                {selectedAvatar ? (
                  <>
                    <h3>Pratinjau Avatar</h3>
                    <Image
                      src={preview}
                      alt="Avatar Preview"
                      width={150}
                      height={150}
                    />
                  </>
                ) : (
                  <>
                    <h3>Pratinjau Avatar</h3>
                    <Image
                      src={`data:image/jpeg;base64,${Buffer.from(
                        selectedUkm.avatar
                      ).toString("base64")}`}
                      alt="Avatar Preview"
                      width={150}
                      height={150}
                    />
                  </>
                )}
              </div>
              <div>
                <label htmlFor="avatar">Profile</label> <br />
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  onChange={handleSelectedEdit}
                />
              </div>
              <div>
                <label htmlFor="post">Tambahkan Post</label> <br />
                <textarea
                  id="post"
                  name="post"
                  rows="4"
                  cols="50"
                  value={selectedUkm.post}
                  onChange={(e) =>
                    setSelectedUkm({ ...selectedUkm, post: e.target.value })
                  }
                ></textarea>
              </div>
              <button type="submit">Submit</button> <br />
              <button
                type="button"
                onClick={() => handleDelete(selectedUkm.id)}
              >
                Hapus Semua
              </button>
            </>
          ) : null}
        </form>
      </div>
      <br />
      <br />

      <h2>Menambahkan Jadwal</h2>
      <select id="ukmSelect" name="ukm" onChange={(e) => setLabelEdit(e.target.value)}>
        {ukms?.length > 0 ? (
          ukms.map((ukm) => (
            <option key={ukm.id} value={ukm.id}>
              {ukm.name}
            </option>
          ))
        ) : (
          <option value="">Tidak ada UKM tersedia</option>
        )}
      </select>
      <button type="button" onClick={() => fetchUkms()}>
        Refresh{" "}
      </button>
      <form onSubmit={handleEvent}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={event.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Start Date and Time:
            <input
              type="datetime-local"
              name="start"
              value={event.start}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            End Date and Time:
            <input
              type="datetime-local"
              name="end"
              value={event.end}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Alamat:
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description (optional):
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
            />
          </label>
        </div>
        
        <button type="submit">Submit</button>
      </form>
      <br />
      <br />
    </div>
  );
}
