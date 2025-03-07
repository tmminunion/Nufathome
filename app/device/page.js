"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LOCAL_API_URL = "http://192.168.1.9:80/status";

export default function IotDoor() {
  const [doorStatus, setDoorStatus] = useState(null);
  const prevStatus = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(LOCAL_API_URL, { timeout: 5000 }); // Timeout 5 detik
        const data = response.data;

        if (!("lampu2" in data)) {
          throw new Error("Respons tidak mengandung lampu2");
        }

        const lampu2Status = data.lampu2;

        if (prevStatus.current !== null && prevStatus.current !== lampu2Status) {
          Swal.fire({
            title: "Status Pintu Berubah!",
            text: lampu2Status === "ON" ? "Pintu sekarang TERBUKA!" : "Pintu sekarang TERTUTUP!",
            icon: "info",
            confirmButtonText: "OK",
          });
        }

        prevStatus.current = lampu2Status;
        setDoorStatus(lampu2Status);
      } catch (error) {
        console.error("Gagal mengambil status pintu:", error.message);
        setDoorStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header title="🔐 IoT Status Pintu Gerbang" />

      <main className="flex flex-col items-center gap-6 mt-8">
        <h2 className="text-lg font-semibold">🚪 Status Pintu Gerbang Rumah</h2>

        {loading ? (
          <p>🔄 Memuat status...</p>
        ) : doorStatus === null ? (
          <p className="text-red-500">⚠️ Gagal mengambil data</p>
        ) : (
          <div
            className={`p-6 w-64 rounded-lg shadow-lg flex flex-col items-center transition ${
              doorStatus === "ON" ? "bg-green-300 dark:bg-green-500" : "bg-rose-200 dark:bg-sky-700"
            }`}
          >
            <Image
              src={doorStatus === "ON" ? "/on.png" : "/off.png"}
              alt="Door Status"
              width={200}
              height={200}
              className="rounded-lg"
              priority={true}
            />
            <p className="mt-3 text-xl font-semibold">
              {doorStatus === "ON" ? "Terbuka" : "Tertutup"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
