"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

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

// Inisialisasi Firebase hanya jika belum ada instance
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function IotDoor() {
  const params = useParams();
  const nama = params.nama; // Ambil parameter dari URL
  const [doorStatus, setDoorStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nama) return; // Hindari error jika parameter belum ada

    const statusRef = ref(database, `status_pintu/${nama}`);
    
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setDoorStatus(data.status);
        Swal.fire({
          title: "Status Pintu Berubah!",
          text: data.status === "on" ? "Pintu sekarang TERBUKA!" : "Pintu sekarang TERTUTUP!",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [nama]);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header title={`🔐 Status Pintu Gerbang - ${nama || "Loading..."}`} />

      <main className="flex flex-col items-center gap-6 mt-8">
        <h2 className="text-lg font-semibold">🚪 Status Pintu Gerbang: {nama}</h2>

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
            <Image
              src={doorStatus === "on" ? "/on.png" : "/off.png"}
              alt="Door Status"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <p className="mt-3 text-xl font-semibold">
              {doorStatus === "on" ? "Terbuka" : "Tertutup"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
