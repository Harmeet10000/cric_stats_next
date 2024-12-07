// models/Match.ts
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    team1: {
      type: String,
      required: true,
      trim: true,
    },
    team2: {
      type: String,
      required: true,
      trim: true,
    },
    overs: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    team1Players: [
      {
        type: String,
        trim: true,
      },
    ],
    team2Players: [
      {
        type: String,
        trim: true,
      },
    ],
    teamScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    wickets: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    currentOver: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentaryList: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);


export const Match = mongoose.model("Match", MatchSchema);

