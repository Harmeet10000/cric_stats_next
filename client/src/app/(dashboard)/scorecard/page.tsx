"use client";
import axios from "axios";
import { useWebSocket } from "@/hooks/useWebSockets";
import { useEffect, useState } from "react";

interface Match {
  _id: string;
  title: string;
}

const ScoreCard: React.FC<> = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { matchData, commentary, connectionStatus, retrying } = useWebSocket(
    selectedMatch?._id || ""
  );
  console.log(matchData);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/matches/fetch")
      .then((response) => {
        setMatches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
      });
  }, []);

  const handleMatchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchId = event.target.value;
    const selected = matches.find((match) => match._id === matchId);
    setSelectedMatch(selected || null); // Update selected match state
  };

  return (
    <div className="score-card">
      <h2>Select a Match</h2>

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

      {selectedMatch && (
        <>
          <h3>Match: {selectedMatch.title}</h3>

          <div className="connection-status">
            <span>Status: {connectionStatus}</span>
            {retrying && <span>Retrying in 15 seconds...</span>}
          </div>

          {matchData ? (
            <div className="score">
              <h4>Score</h4>
              <p>
                {matchData.teamA} vs {matchData.teamB}
              </p>
              <p>
                {matchData.teamA}: {matchData.scoreA} - {matchData.teamB}:{" "}
                {matchData.scoreB}
              </p>
            </div>
          ) : (
            <p>Loading score...</p>
          )}

          <div className="commentary">
            <h4>Live Commentary</h4>
            {commentary.length > 0 ? (
              <ul>
                {commentary.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
            ) : (
              <p>No commentary yet...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreCard;
