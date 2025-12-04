"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function InterestPage() {
  const { user, token, refreshProfile } = useAuth();
  const [interests, setInterests] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.interests && Array.isArray(user.interests)) {
      setInterests(user.interests);
    }
  }, [token, user, router]);

  const addInterest = () => {
    const val = input.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
      setInput("");
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await api.updateProfile({ interests });
      await refreshProfile();
      router.push("/profile");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="text-gray-500 font-medium">← Back</button>
        <button onClick={handleSave} className="text-primary font-semibold" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <h1 className="text-primary text-sm font-semibold mb-2">Tell everyone about yourself</h1>
      <h2 className="text-2xl font-bold mb-6">What interests you?</h2>

      {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl">{error}</p>}

      <div className="card min-h-[150px]">
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map((item) => (
            <span key={item} className="bg-primary/20 text-dark px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
              {item}
              <button onClick={() => removeInterest(item)} className="text-gray-500 hover:text-dark">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="w-full bg-transparent outline-none text-dark placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addInterest();
            }
          }}
          placeholder="Type and press Enter to add..."
        />
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {["Music", "Travel", "Photography", "Fitness", "Reading", "Cooking", "Art", "Gaming"].map((s) => (
            <button
              key={s}
              onClick={() => !interests.includes(s) && setInterests([...interests, s])}
              className={`tag ${interests.includes(s) ? "bg-primary/20" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
