"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createMatch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateMatchPage() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [overs, setOvers] = useState("");
  const [title, setTitle] = useState("");
  const [team1Players, setTeam1Players] = useState("");
  const [team2Players, setTeam2Players] = useState("");
//   const [matchDate, setMatchDate] = useState("");
//   const [matchTime, setMatchTime] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMatch({
        team1,
        team2,
        overs: parseInt(overs),
        title,
        team1Players: team1Players.split(",").map((p) => p.trim()),
        team2Players: team2Players.split(",").map((p) => p.trim()),
        // matchDateTime: new Date(`${matchDate}T${matchTime}`).toISOString(),
      });

      toast({
        title: "Match Created",
        description: "New match has been scheduled successfully",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Match Creation Failed",
        description: "Unable to create match",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Cricket Match</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Match Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Team 1 Name"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Team 2 Name"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                required
              />
            </div>
            <Input
              type="number"
              placeholder="Number of Overs"
              value={overs}
              onChange={(e) => setOvers(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Team 1 Players (comma-separated)"
              value={team1Players}
              onChange={(e) => setTeam1Players(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Team 2 Players (comma-separated)"
              value={team2Players}
              onChange={(e) => setTeam2Players(e.target.value)}
              required
            />
            <div className="flex space-x-2">
              {/* <Input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
              /> */}
              {/* <Input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                required
              /> */}
            </div>
            <Button type="submit" className="w-full">
              Create Match
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
