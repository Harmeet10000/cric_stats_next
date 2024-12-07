// src/app/(dashboard)/layout.tsx
"use client"
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  // console.log("user",user)

  if (!user) {
    console.log("2", user)
    redirect("/login");
  }

  return <div className="container mx-auto px-4 py-6">{children}</div>;
}
