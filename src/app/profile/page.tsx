"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, Profile } from "@/lib/api";
import { getZodiac, getHoroscope, calculateAge } from "@/lib/zodiac";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user, token, refreshProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
    if (user) setForm(user);
  }, [token, user, router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateProfile(form);
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setForm({ ...form, image: base64 });
        try {
          await api.updateProfile({ image: base64 });
          await refreshProfile();
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const age = form.birthday ? calculateAge(form.birthday) : null;
  const zodiac = form.birthday ? getZodiac(form.birthday) : null;
  const horoscope = form.birthday ? getHoroscope(form.birthday) : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 shadow-xl">
            <button onClick={() => setMenuOpen(false)} className="mb-6 text-gray-500">✕ Close</button>
            <nav className="space-y-2">
              <Link href="/" className="block py-2 px-3 rounded-lg hover:bg-gray-100">🏠 Home</Link>
              <Link href="/chat" className="block py-2 px-3 rounded-lg hover:bg-gray-100">💬 Messages</Link>
              <Link href="/interest" className="block py-2 px-3 rounded-lg hover:bg-gray-100">❤️ Interests</Link>
              <hr className="my-4" />
              <button onClick={() => { logout(); router.push("/"); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 text-red-500">
                🚪 Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Header with gradient */}
      <div className="relative h-72 bg-gradient-to-br from-primary/30 to-accent/50 rounded-b-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/40 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/50 rounded-full" />
        
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center">←</button>
          <h1 className="text-xl font-bold">My Profile</h1>
          <button onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center">☰</button>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mt-4">
          <div 
            className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white cursor-pointer relative"
            onClick={() => fileRef.current?.click()}
          >
            {form.image ? (
              <Image src={form.image} alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <span className="text-white text-sm">📷 Change</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-8">
        <div className="card text-center">
          <h2 className="text-xl font-bold">{form.name || form.username || "Your Name"}</h2>
          <p className="text-gray-500">@{form.username}</p>
          {form.birthday && (
            <p className="text-sm text-gray-400 mt-1">{age} years old • {horoscope} • {zodiac}</p>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-4 py-4 border-t border-b border-gray-100">
            <div className="text-center">
              <p className="text-xl font-bold">1,359</p>
              <p className="text-xs text-gray-400">Likes You</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">876</p>
              <p className="text-xs text-gray-400">Matches</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">28</p>
              <p className="text-xs text-gray-400">Dates</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button className="tag">Likes you</button>
            <button className="tag">Matches</button>
            <button className="tag">Dates</button>
          </div>
        </div>

        {/* About Section */}
        <div className="card mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">About</h3>
            <button onClick={() => setEditing(!editing)} className="text-primary text-sm font-semibold">
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input type="text" placeholder="Display Name" className="input-field" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select className="input-field" value={form.gender || ""} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input type="date" className="input-field" value={form.birthday || ""} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Height (cm)" className="input-field" value={form.height || ""} onChange={(e) => setForm({ ...form, height: +e.target.value })} />
                <input type="number" placeholder="Weight (kg)" className="input-field" value={form.weight || ""} onChange={(e) => setForm({ ...form, weight: +e.target.value })} />
              </div>
              <button onClick={handleSave} className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {form.birthday && (
                <>
                  <p><span className="text-gray-400">Birthday:</span> {new Date(form.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  <p><span className="text-gray-400">Horoscope:</span> {horoscope}</p>
                  <p><span className="text-gray-400">Zodiac:</span> {zodiac}</p>
                </>
              )}
              {form.gender && <p><span className="text-gray-400">Gender:</span> {form.gender}</p>}
              {form.height && <p><span className="text-gray-400">Height:</span> {form.height} cm</p>}
              {form.weight && <p><span className="text-gray-400">Weight:</span> {form.weight} kg</p>}
              {!form.birthday && !form.gender && <p className="text-gray-400">Add your details to find better matches</p>}
            </div>
          )}
        </div>

        {/* Interests Section */}
        <div className="card mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Interests</h3>
            <Link href="/interest" className="text-primary text-sm font-semibold">Edit</Link>
          </div>
          {user?.interests?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.map((i) => (
                <span key={i} className="tag">{i}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Add your interests to find like-minded people</p>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <Link href="/" className="p-2">🏠</Link>
        <Link href="/profile" className="p-2">❤️</Link>
        <Link href="/chat" className="p-2">💬</Link>
        <Link href="/profile" className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full"><span>👤</span></Link>
      </nav>
    </div>
  );
}
