// controllers/matchController.ts
import { Match } from "../models/MatchModel.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";

// @desc    Create new match
// @route   POST /api/matches
export const createMatch = asyncHandler(async (req, res) => {
  const {
    team1,
    team2,
    overs,
    title,
    team1Players,
    team2Players,
    // matchDateTime,
  } = req.body;

  const match = await Match.create({
    team1,
    team2,
    overs,
    title,
    team1Players,
    team2Players,
    // matchDateTime,
    teamScore: 0,
    wickets: 0,
    currentOver: 0,
    commentaryList: [],
    status: "upcoming",
  });

  res.status(201).json(match);
});

// @desc    Update match score
// @route   PUT /api/matches/:id/score
export const updateMatchScore = asyncHandler(
  async (req, res) => {
    const { runs, extras, wicket, bowlerChange } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      res.status(404);
      throw new Error("Match not found");
    }

    // Update score logic
    match.teamScore += runs + extras;

    if (wicket) {
      match.wickets += 1;
    }

    // Add commentary
    match.commentaryList.push(
      `${runs} runs ${extras > 0 ? `+ ${extras} extras` : ""}`
    );

    await match.save();

    res.json(match);
  }
);

// @desc    Get match details
// @route   GET /api/matches/:id
export const getMatchDetails = asyncHandler(async (req, res) => {
  // Fetch all matches from the database
  const matches = await Match.find();

  // Check if matches are found
  if (!matches || matches.length === 0) {
    res.status(404);
    throw new Error("No matches found");
  }

  // Send the response with the matches
  res.json(matches);
});

// @desc    Get all matches
// @route   GET /api/matches
export const getAllMatches = asyncHandler(
  async (req, res) => {
    const matches = await Match.find({});
    res.json(matches);
  }
);
