
import mongoose from "mongoose";


const BowlerSchema = new mongoose.Schema({
  name: String,
  overs: { type: Number, default: 0 },
  runsGiven: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
});
export const Bowler = mongoose.model("Match", BowlerSchema);