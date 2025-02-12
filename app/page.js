"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [devices, setDevices] = useState({
    lamp: false,
    fan: false,
    door: false,
  });

  const toggleDevice = (device) => {
    setDevices((prev) => ({ ...prev, [device]: !prev[device] }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-xl font-bold">🏡 Smart Home Dashboard</h1>
        <Image src="https://picsum.photos/40?random=100" alt="IoT Icon" width={40} height={40} className="rounded-lg" />
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6 mt-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-center">📡 Status Perangkat</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Lampu */}
          <div
            className={`p-6 rounded-lg shadow-lg flex flex-col items-center transition ${
              devices.lamp ? "bg-yellow-300 dark:bg-yellow-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Image src="https://picsum.photos/80?random=1" alt="Lamp Icon" width={80} height={80} className="rounded-lg" />
            <p className="mt-2 text-sm">{devices.lamp ? "Hidup" : "Mati"}</p>
            <button
              className="mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => toggleDevice("lamp")}
            >
              {devices.lamp ? "Matikan" : "Nyalakan"}
            </button>
          </div>

          {/* Kipas */}
          <div
            className={`p-6 rounded-lg shadow-lg flex flex-col items-center transition ${
              devices.fan ? "bg-blue-300 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Image src="https://picsum.photos/80?random=2" alt="Fan Icon" width={80} height={80} className="rounded-lg" />
            <p className="mt-2 text-sm">{devices.fan ? "Hidup" : "Mati"}</p>
            <button
              className="mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => toggleDevice("fan")}
            >
              {devices.fan ? "Matikan" : "Nyalakan"}
            </button>
          </div>

          {/* Pintu */}
          <div
            className={`p-6 rounded-lg shadow-lg flex flex-col items-center transition ${
              devices.door ? "bg-green-300 dark:bg-green-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Image src="https://picsum.photos/80?random=3" alt="Door Icon" width={80} height={80} className="rounded-lg" />
            <p className="mt-2 text-sm">{devices.door ? "Terbuka" : "Tertutup"}</p>
            <button
              className="mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => toggleDevice("door")}
            >
              {devices.door ? "Tutup" : "Buka"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm">
        <p>© {new Date().getFullYear()} Smart Home | Powered by Next.js</p>
      </footer>
    </div>
  );
}