"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

const nearbyUsers = [
  { name: "Margaret", age: 24, location: "Nearby", img: "/images/user1.jpg" },
  { name: "Ayesha", age: 29, location: "London", img: "/images/user2.jpg" },
  { name: "Catherine", age: 24, location: "USA", img: "/images/user3.jpg" },
  { name: "Sienna", age: 29, location: "Switzerland", img: "/images/user4.jpg" },
];

export default function Home() {
  const { token, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">💫</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">YouApp</h1>
        <p className="text-gray-500 mb-8 text-center">Find your perfect match based on horoscope compatibility</p>
        <Link href="/login" className="btn-primary text-center mb-3">Login</Link>
        <Link href="/register" className="w-full py-3 rounded-xl border border-gray-200 text-center font-semibold">Register</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">👤</div>
              <div>
                <p className="font-semibold">{user?.name || user?.username}</p>
                <p className="text-sm text-gray-400">@{user?.username}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <Link href="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-100">👤 Profile</Link>
              <Link href="/chat" className="block py-2 px-3 rounded-lg hover:bg-gray-100">💬 Messages</Link>
              <Link href="/interest" className="block py-2 px-3 rounded-lg hover:bg-gray-100">❤️ Interests</Link>
              <hr className="my-4" />
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 text-red-500">
                🚪 Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-4 py-4">
        <button onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">☰</button>
        <h1 className="text-xl font-bold">Discover</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">🔍</button>
      </header>

      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">New Matches</h2>
          <span className="text-sm text-gray-400">View more</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {["Helena", "Jessica", "Jenny", "Eleanor"].map((name, i) => (
            <div key={name} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                <Image src={`/images/user${(i % 4) + 1}.jpg`} alt={name} width={56} height={56} className="object-cover" />
              </div>
              <span className="text-xs mt-1">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Near You</h2>
          <span className="text-sm text-gray-400">View more</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {nearbyUsers.map((p) => (
            <div key={p.name} className="relative rounded-2xl overflow-hidden aspect-[3/4]">
              <Image src={p.img} alt={p.name} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                <p className="font-semibold">{p.name}, {p.age}</p>
                <p className="text-xs opacity-80">📍 {p.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav className="bottom-nav">
        <Link href="/" className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full"><span>🏠</span> Home</Link>
        <Link href="/profile" className="p-2">❤️</Link>
        <Link href="/chat" className="p-2">💬</Link>
        <Link href="/profile" className="p-2">👤</Link>
      </nav>
    </div>
  );
}
