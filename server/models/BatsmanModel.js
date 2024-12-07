import mongoose from "mongoose";

const BatsmanSchema = new mongoose.Schema({
  name: String,
  runs: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
});
export const Batsman = mongoose.model("Match", BatsmanSchema);
