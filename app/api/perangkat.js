import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Menggunakan variabel lingkungan untuk kredensial Firebase
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Inisialisasi Firebase Admin jika belum diinisialisasi
if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

export async function POST(req) {
  try {
    const body = await req.json(); // Untuk membaca body dalam format JSON
    const { device_name, device_id, local_ip, start_time } = body;

    if (!device_name || !device_id || !local_ip || !start_time) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.collection("devices").doc(device_id).set({
      device_name,
      device_id,
      local_ip,
      start_time,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Device data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
