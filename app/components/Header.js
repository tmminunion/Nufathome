"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";

export default function Header({ title }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-blue-900 dark:bg-blue-400 shadow-md rounded-lg">
      {/* Ubah background menjadi bg-blue-900 */}
      <Link href="/">
        <AiOutlineHome 
          size={40} 
          className="cursor-pointer text-white dark:text-white" // Ubah warna teks menjadi putih
        />
      </Link>

      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold text-white dark:text-white">{title}</h1> {/* Teks putih */}
      </div>

      <div className="text-right">
        <p className="text-sm text-white dark:text-white">{formatDate(time)}</p> {/* Teks putih */}
        <p className="text-lg font-semibold text-white dark:text-white">
          {time.toLocaleTimeString("id-ID", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit" 
          })}
        </p>
      </div>
    </header>
  );
}