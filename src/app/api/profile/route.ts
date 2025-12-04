import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get("x-access-token");
  const res = await fetch("https://techtest.youapp.ai/api/getProfile", {
    headers: { "x-access-token": token || "" },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const token = request.headers.get("x-access-token");
  const body = await request.json();
  const res = await fetch("https://techtest.youapp.ai/api/updateProfile", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-access-token": token || "" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
