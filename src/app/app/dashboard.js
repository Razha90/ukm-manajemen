"use client"; // Jika menggunakan App Router di Next.js 13+

import TambahkanUKM from "./tambahkanUKM";
import EditUKM from "./editUKM";

export default function Dashboard() {
  return (
    <div>
      <TambahkanUKM />
      <br />
      <br />

      <EditUKM />
    </div>
  );
}
