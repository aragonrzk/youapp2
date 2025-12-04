async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "x-access-token": token }),
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  register: (data: { email: string; username: string; password: string }) =>
    request("/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; username: string; password: string }) =>
    request<{ access_token: string }>("/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request<{ data: Profile }>("/profile"),
  updateProfile: (data: Partial<Profile>) =>
    request("/profile", { method: "PUT", body: JSON.stringify(data) }),
};

export interface Profile {
  email?: string;
  username?: string;
  name?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  interests?: string[];
  horoscope?: string;
  zodiac?: string;
  gender?: string;
  image?: string;
}
