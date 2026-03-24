"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="mt-4 bg-white text-black px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}