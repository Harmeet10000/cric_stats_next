"use client";

import { useEffect, useState } from "react";
import { ScoreDisplay } from "@/components/scoreboard/ScoreDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import axios from "axios";

interface Match {
  _id: string;
  team1: string;
  team2: string;
  overs: number;
  title: string;
  team1Players: string[];
  team2Players: string[];
  teamScore: number;
  wickets: number;
  currentOver: number;
  commentaryList: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AudienceDashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (user && user.role === "audience") {
      axios
        .get("http://localhost:8000/api/matches/fetch")
        .then((response) => {
          setMatches(response.data);
        })
        .catch((error) => {
          console.error("Error fetching matches:", error);
        });
    }
  }, [user]);

  if (!user || user.role !== "audience") {
    redirect("/login");
  }

  const handleMatchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchId = event.target.value;
    const selectedMatch =
      matches.find((match) => match._id === matchId) || null;
    setSelectedMatch(selectedMatch);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="match-select"
          className="block text-lg font-medium mb-2"
        >
          Select a Match:
        </label>
        <select
          id="match-select"
          className="block w-full p-2 border border-gray-300 rounded-md"
          value={selectedMatch?._id || ""}
          onChange={handleMatchChange}
        >
          <option value="" disabled>
            Select a match
          </option>
          {matches.map((match) => (
            <option key={match._id} value={match._id}>
              {match.title}
            </option>
          ))}
        </select>
      </div>
      {selectedMatch && <ScoreDisplay match={selectedMatch} />}
    </div>
  );
}
