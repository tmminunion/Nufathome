"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC4rPNjXuLFGI7Se2uH59Q8N7ygNXm8YwI",
  authDomain: "ibnu-fatin.firebaseapp.com",
  databaseURL: "https://ibnu-fatin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ibnu-fatin",
  storageBucket: "ibnu-fatin.firebasestorage.app",
  messagingSenderId: "807591829232",
  appId: "1:807591829232:web:0b95fd6a2474579ddeec35",
  measurementId: "G-S4WDYCR3C1"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Konfigurasi tampilan perangkat
const devicesConfig = {
  lamp: {
    color: "bg-yellow-300 dark:bg-yellow-500",
    buttonText: ["Nyalakan", "Matikan"],
    statusText: ["Mati", "Hidup"]
  },
  fan: {
    color: "bg-blue-300 dark:bg-blue-500",
    buttonText: ["Nyalakan", "Matikan"],
    statusText: ["Mati", "Hidup"]
  },
  door: {
    color: "bg-green-300 dark:bg-green-500",
    buttonText: ["Buka", "Tutup"],
    statusText: ["Tertutup", "Terbuka"]
  }
};

export default function Home() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);

  // Listen for database changes
  useEffect(() => {
    const devicesRef = ref(database, 'Alat/devices');
    
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      setDevices(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDevice = async (deviceId) => {
    const newStatus = !devices[deviceId].status;
    
    try {
      await update(ref(database, `Alat/devices/${deviceId}`), {
        status: newStatus
      });
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8">
        <h1 className="text-xl font-bold">🏡 Smart Home Dashboard</h1>
        <Image 
          src="https://picsum.photos/40?random=100" 
          alt="IoT Icon" 
          width={40} 
          height={40} 
          className="rounded-lg"
        />
      </header>

      {/* Main Content */}
      <main className="w-full">
        <h2 className="text-lg font-semibold text-center mb-6">📡 Status Perangkat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(devices).map((deviceId) => {
            const device = devices[deviceId];
            const config = devicesConfig[deviceId];
            const statusIndex = device.status ? 1 : 0;

            // Generate local and remote URLs
            const localUrl = `http://${device.iplokal}:${device.port}`;
            const remoteUrl = `/device/${deviceId}`;

            return (
              <div
                key={deviceId}
                className={`p-6 rounded-lg shadow-lg flex flex-col items-center transition ${
                  device.status ? config.color : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Image
                  src={device.image}
                  alt={`${device.label} Icon`}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <p className="mt-2 text-sm font-semibold">{device.label}</p>
                <p className="mt-1 text-sm">{config.statusText[statusIndex]}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {device.iplokal}:{device.port}
                </div>
                <button
                  className="mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={() => toggleDevice(deviceId)}
                >
                  {config.buttonText[statusIndex]}
                </button>
                {/* Tambahkan link Local Network dan Remote Network */}
                <div className="mt-3 flex flex-col gap-2 w-full">
                  <a
                    href={localUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors text-center"
                  >
                    Local Network
                  </a>
                  <a
                    href={remoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors text-center"
                  >
                    Remote Network
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}