import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

export function useWebSocket(matchId: string) {
  const [socket, setSocket] = useState<any>(null);
  const [matchData, setMatchData] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    if (!matchId) {
      console.error("Match ID is undefined!");
      return;
    }

    // Create Socket.IO client
    const newSocket = io("http://localhost:8000", {
      query: { matchId },
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Socket.IO connection established");
      setConnectionStatus("connected");

      

      // Join specific rooms for this match
      newSocket.emit("joinRoom", `${matchId}-scoreUpdate`);
      newSocket.emit("joinRoom", `${matchId}-comments`);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setConnectionStatus("disconnected");
    });

    // Listen for score updates
    newSocket.on("scoreUpdate", (updateData) => {
      setMatchData(updateData);
    });

    // Listen for commentary updates
    newSocket.on("commentaryUpdate", (newComment) => {
      setCommentary((prevCommentary) => [...prevCommentary, newComment]);
    });

    // Error handling
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionStatus("disconnected");
    });

    // Set the socket in state
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  // Send score update
  const sendScoreUpdate = useCallback(
    (updateData) => {
      if (socket && socket.connected) {
        socket.emit("updateScore", {
          matchId,
          ...updateData,
        });
      }
    },
    [socket, matchId]
  );

  // Send commentary update
  const sendCommentaryUpdate = useCallback(
    (comment) => {
      if (socket && socket.connected) {
        socket.emit("updateCommentary", { matchId, comment });
      }
    },
    [socket, matchId]
  );

  return {
    matchData,
    commentary,
    sendScoreUpdate,
    sendCommentaryUpdate,
    connectionStatus,
  };
}
