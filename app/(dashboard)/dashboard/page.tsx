"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [score, setScore] = useState("");
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from("scores")
        .select("*")
        .order("created_at", { ascending: false });

      setScores(data || []);
    };

    if (user) fetchScores();
  }, [user]);

  const addScore = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) return;

    await supabase.from("scores").insert({
      user_id: currentUser.id,
      score: Number(score),
    });

    const { data } = await supabase
      .from("scores")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 5) {
      const extra = data.slice(5);

      for (let item of extra) {
        await supabase.from("scores").delete().eq("id", item.id);
      }
    }

    location.reload();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
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

      <div className="mt-6">
        <input
          placeholder="Enter score (1-45)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border p-2 mr-2 text-black"
        />

        <button
          onClick={addScore}
          className="bg-white text-black px-4 py-2"
        >
          Add Score
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl mb-2">Your Scores</h2>

        {scores.map((s) => (
          <p key={s.id}>{s.score}</p>
        ))}
      </div>
    </div>
  );
}