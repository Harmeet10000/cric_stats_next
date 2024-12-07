// src/app/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Cricket Scoring System</h1>
      {user ? (
        <Button
          onClick={() =>
            user.role === "admin"
              ? router.push("/admin/score")
              : router.push("/dashboard")
          }
          className="text-lg px-6 py-3"
        >
          Go to {user.role === "admin" ? "Scoring Panel" : "Dashboard"}
        </Button>
      ) : (
        <Button
          onClick={() => router.push("/login")}
          className="text-lg px-6 py-3"
        >
          Login
        </Button>
      )}
    </div>
  );
}
