// src/types/match.ts
export interface Batsman {
  id: string;
  name: string;
  runs: number;
  ballsFaced: number;
  strikeRate: number;
}

export interface Bowler {
  id: string;
  name: string;
  overs: number;
  runsGiven: number;
  wickets: number;
  economy: number;
}

export interface MatchState {
  teamScore: number;
  currentBatsman: Batsman;
  currentBowler: Bowler;
  wickets: number;
  currentOver: number;
  commentaryList: string[];
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "audience";
  name?: string;
}