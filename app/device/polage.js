"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image"; // Gunakan Image dari Next.js
import Header from "../components/Header";
import Footer from "../components/Footer";

const LOCAL_API_URL = "http://192.168.1.9:80/status"; // Ganti dengan IP ESP32

export default function IotDoor() {
  const [doorStatus, setDoorStatus] = useState(null);
  const [prevStatus, setPrevStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(LOCAL_API_URL);
        const data = await response.json();

        // Jika status berubah, tampilkan pop-up notifikasi
        if (prevStatus !== null && prevStatus !== data.lampu2) {
          Swal.fire({
            title: "Status Pintu Berubah!",
            text: data.status === "on" ? "Pintu sekarang TERBUKA!" : "Pintu sekarang TERTUTUP!",
            icon: "info",
            confirmButtonText: "OK",
          });
        }

        setPrevStatus(data.status);
        setDoorStatus(data.status);
      } catch (error) {
        console.error("Gagal mengambil status pintu:", error);
        setDoorStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update setiap 5 detik

    return () => clearInterval(interval);
  }, [prevStatus]);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
    <Header title="🔐 IoT Status Pintu Gerbang" />

      {/* Status Pintu */}
      <main className="flex flex-col items-center gap-6 mt-8">
        <h2 className="text-lg font-semibold">🚪 Status Pintu Gerbang Rumah</h2>

        {loading ? (
          <p>🔄 Memuat status...</p>
        ) : doorStatus === null ? (
          <p className="text-red-500">⚠️ Gagal mengambil data</p>
        ) : (
          <div
            className={`p-6 w-64 rounded-lg shadow-lg flex flex-col items-center transition ${
              doorStatus === "on" ? "bg-green-300 dark:bg-green-500" : "bg-rose-200 dark:bg-sky-700"
            }`}
          >
            {/* Gunakan Next.js Image Component */}
            <Image
              src={doorStatus === "on" ? "/on.png" : "/off.png"}
              alt="Door Status"
              width={200} // Ukuran gambar
              height={200} // Ukuran gambar
              className="rounded-lg"
            />
            <p className="mt-3 text-xl font-semibold">
              {doorStatus === "on" ? "Terbuka" : "Tertutup"}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
<Footer />
    </div>
  );
}