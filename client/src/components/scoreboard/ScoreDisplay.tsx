import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"; // Adjust the path to your Dialog components
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSockets";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

export function ScoreDisplay({ match }) {
  const { matchData, commentary, sendScoreUpdate, sendCommentaryUpdate } =
    useWebSocket(match._id);
  const [selectedBatsman1, setSelectedBatsman1] = useState("");
  const [selectedBatsman2, setSelectedBatsman2] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [currentStriker, setCurrentStriker] = useState<string | null>(null);
  const [lastBalls, setLastBalls] = useState<string[]>([]);
  const [currentKeyCombo, setCurrentKeyCombo] = useState("");
  const [currentCommentary, setCurrentCommentary] = useState(commentary || []);

  const [matchScore, setMatchScore] = useState({
    teamScore: 0,
    wickets: 0,
    currentBatsman1: { runs: 0, balls: 0 },
    currentBatsman2: { runs: 0, balls: 0 },
    currentBowler: { balls: 0, runs: 0 },
  });

  useEffect(() => {
    setMatchScore(
      matchData || {
        teamScore: 0,
        wickets: 0,
        currentBatsman1: { runs: 0, balls: 0 },
        currentBatsman2: { runs: 0, balls: 0 },
        currentBowler: { balls: 0, runs: 0 },
      }
    );
    setCurrentCommentary(commentary || []);
  }, [matchData, commentary]);

  // Keyboard Event Handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const newCombo = currentKeyCombo + key;
      setCurrentKeyCombo(newCombo);

      if (KEYBOARD_SHORTCUTS.runs[newCombo]) {
        KEYBOARD_SHORTCUTS.runs[newCombo]();
        setCurrentKeyCombo("");
      } else if (KEYBOARD_SHORTCUTS.extras[newCombo]) {
        KEYBOARD_SHORTCUTS.extras[newCombo]();
        setCurrentKeyCombo("");
      } else if (KEYBOARD_SHORTCUTS.action[newCombo]) {
        KEYBOARD_SHORTCUTS.action[newCombo]();
        setCurrentKeyCombo("");
      }

      setTimeout(() => {
        setCurrentKeyCombo("");
      }, 500);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentKeyCombo]);

  const handleRunScore = (runs: number) => {
    setMatchScore((prev) => {
      const newScore = {
        ...prev,
        teamScore: prev.teamScore + runs,
        currentBatsman1: {
          runs:
            currentStriker === selectedBatsman1
              ? prev.currentBatsman1.runs + runs
              : prev.currentBatsman1.runs,
          balls:
            currentStriker === selectedBatsman1
              ? prev.currentBatsman1.balls + 1
              : prev.currentBatsman1.balls,
        },
        currentBatsman2: {
          runs:
            currentStriker === selectedBatsman2
              ? prev.currentBatsman2.runs + runs
              : prev.currentBatsman2.runs,
          balls:
            currentStriker === selectedBatsman2
              ? prev.currentBatsman2.balls + 1
              : prev.currentBatsman2.balls,
        },
        currentBowler: {
          runs: prev.currentBowler.runs + runs,
          balls: prev.currentBowler.balls + 1,
        },
      };
      sendScoreUpdate(newScore);
      return newScore;
    });

    setLastBalls((prev) => [runs.toString(), ...prev.slice(0, 17)]);
    if (runs % 2 !== 0) {
      setCurrentStriker(
        currentStriker === selectedBatsman1
          ? selectedBatsman2
          : selectedBatsman1
      );
    }
    setCurrentCommentary((prev) => {
      const newCommentary = [`${runs} runs scored`, ...prev];
      sendCommentaryUpdate(`${runs} runs scored`);
      return newCommentary;
    });
  };

  const handleExtras = (type: string) => {
    setMatchScore((prev) => {
      const newScore = { ...prev, teamScore: prev.teamScore + 1 };
      sendScoreUpdate(newScore);
      return newScore;
    });
    setCurrentCommentary((prev) => {
      const newCommentary = [`${type} called`, ...prev];
      sendCommentaryUpdate(`${type} called`);
      return newCommentary;
    });
  };

  const handleWicket = () => {
    setMatchScore((prev) => {
      const newScore = {
        ...prev,
        wickets: prev.wickets + 1,
        currentBowler: {
          ...prev.currentBowler,
          balls: prev.currentBowler.balls + 1,
        },
      };
      sendScoreUpdate(newScore);
      return newScore;
    });
    setCurrentCommentary((prev) => {
      const newCommentary = ["Wicket fallen!", ...prev];
      sendCommentaryUpdate("Wicket fallen!");
      return newCommentary;
    });
    setLastBalls((prev) => ["W", ...prev.slice(0, 17)]);
    if (currentStriker === selectedBatsman1) {
      setSelectedBatsman1("");
      setCurrentStriker(selectedBatsman2);
    } else {
      setSelectedBatsman2("");
      setCurrentStriker(selectedBatsman1);
    }
  };

  const KEYBOARD_SHORTCUTS = {
    runs: {
      "1": () => handleRunScore(1),
      "2": () => handleRunScore(2),
      "3": () => handleRunScore(3),
      "4": () => handleRunScore(4),
      "5": () => handleRunScore(5),
      "6": () => handleRunScore(6),
      "0": () => handleRunScore(0),
    },
    extras: {
      WD: () => handleExtras("wide"),
      NB: () => handleExtras("no-ball"),
    },
    action: {
      WK: () => handleWicket(),
    },
  };

  const commentaryButtons = [
    "Bowler Stop",
    "Appeal",
    "Ball in Air",
    "Catch Drop",
    "Leg Bye",
    "Bye",
    "Third Empire",
    "Review",
    "Misfield",
    "Overthrow",
    "Ball Start",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <h2 className="text-xl font-bold">{match.team1}</h2>
              <p className="text-2xl">
                {matchScore.teamScore}/{matchScore.wickets}
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{match.team2}</h2>
              <p className="text-2xl">0/0</p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Batsmen</h3>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={selectedBatsman1}
                onValueChange={setSelectedBatsman1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Batsman 1" />
                </SelectTrigger>
                <SelectContent>
                  {match.team1Players.map((player, index) => (
                    <SelectItem key={index} value={player}>
                      {player} (0 runs, 0 balls)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedBatsman2}
                onValueChange={setSelectedBatsman2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Batsman 2" />
                </SelectTrigger>
                <SelectContent>
                  {match.team1Players.map((player, index) => (
                    <SelectItem key={index} value={player}>
                      {player} (0 runs, 0 balls)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Bowler</h3>
            <Select value={selectedBowler} onValueChange={setSelectedBowler}>
              <SelectTrigger>
                <SelectValue placeholder="Select Bowler" />
              </SelectTrigger>
              <SelectContent>
                {match.team2Players.map((player, index) => (
                  <SelectItem key={index} value={player}>
                    {player} (0 overs, 0 runs)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Bowler</h3>
            <Select value={selectedBowler} onValueChange={setSelectedBowler}>
              <SelectTrigger>
                <SelectValue placeholder="Bowler" />
              </SelectTrigger>
              <SelectContent>
                {match.team2Players.map((player, index) => (
                  <SelectItem key={index} value={player}>
                    {player} ({matchScore.currentBowler.balls} balls,{" "}
                    {matchScore.currentBowler.runs} runs)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Add Dialog Trigger to toggle the modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Keyboard Shortcuts</Button>
          </DialogTrigger>

          {/* Dialog for keyboard shortcuts */}
          <DialogContent>
            <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
            <ul>
              <li>
                <strong>Runs:</strong> 1, 2, 3, 4, 5, 6, 0
              </li>
              <li>
                <strong>Extras:</strong> WD (Wide), NB (No Ball)
              </li>
              <li>
                <strong>Action:</strong> WK (Wicket)
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      <CardContent>
        {/* <div className="grid grid-cols-3 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
            <Button
              key={runs}
              onClick={() => handleRunScore(runs)}
              variant="outline"
            >
              {runs} Runs
            </Button>
          ))}
          <Button onClick={() => handleExtras("wide")} variant="secondary">
            Wide
          </Button>
          <Button onClick={() => handleExtras("no-ball")} variant="secondary">
            No Ball
          </Button>
          <Button onClick={() => handleWicket()} variant="destructive">
            Wicket
          </Button>
        </div> */}
        <div className="grid grid-cols-3 gap-2">
          {commentaryButtons.map((button) => (
            <Button
              key={button}
              variant="outline"
              onClick={() => {
                if (!currentCommentary.includes(`${button} noted`)) {
                  setCurrentCommentary((prev) => [`${button} noted`, ...prev]);
                }
              }}
            >
              {button}
            </Button>
          ))}
        </div>
      </CardContent>

      {/* Last 18 Balls */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Last 18 Balls</h3>
        <div className="flex space-x-2">
          {lastBalls.slice(0, 18).map((ball, index) => (
            <div key={index} className="p-2 border border-gray-300 rounded-lg">
              {ball}
            </div>
          ))}
        </div>
      </div>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ball-by-Ball Commentary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentCommentary.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                {comment}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
