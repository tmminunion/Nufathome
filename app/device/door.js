"use client";
import { useState, useEffect } from "react";

const LOCAL_API_URL = "http://192.168.1.100/status"; // Ganti dengan IP ESP32

export default function IotDoor() {
  const [doorStatus, setDoorStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch status dari ESP32 setiap 5 detik
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(LOCAL_API_URL);
        const data = await response.json();
        setDoorStatus(data.status); // Status dari ESP32
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
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-xl font-bold">🔐 IoT Pintu</h1>
      </header>

      {/* Status Pintu */}
      <main className="flex flex-col items-center gap-6 mt-8">
        <h2 className="text-lg font-semibold">🚪 Status Pintu</h2>

        {loading ? (
          <p>🔄 Memuat status...</p>
        ) : doorStatus === null ? (
          <p className="text-red-500">⚠️ Gagal mengambil data</p>
        ) : (
          <div
            className={`p-6 w-64 rounded-lg shadow-lg flex flex-col items-center transition ${
              doorStatus === "on" ? "bg-green-300 dark:bg-green-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <img
              src={`https://picsum.photos/200/200?random=${doorStatus === "on" ? 1 : 2}`}
              alt="Door"
              className="w-32 h-32 rounded-lg"
            />
            <p className="mt-3 text-xl font-semibold">
              {doorStatus === "on" ? "Terbuka" : "Tertutup"}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm">
        <p>© {new Date().getFullYear()} Smart Home | Powered by Next.js</p>
      </footer>
    </div>
  );
}