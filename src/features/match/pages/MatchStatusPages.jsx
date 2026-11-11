import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MatchShell from "../components/MatchShell";
import { loadMatch, saveMatch } from "../services/matchRepository";
import { createInnings } from "../services/scoringEngine";

export function InningsBreakPage() {
  const { matchId } = useParams(); const navigate = useNavigate(); const [match, setMatch] = useState(); useEffect(() => { loadMatch(matchId).then(setMatch); }, [matchId]);
  if (!match) return <MatchShell>Loading…</MatchShell>; const first = match.innings[1];
  const startSecondInnings = async () => { const next = structuredClone(match); next.innings[2] = createInnings({ number: 2, battingTeam: first.bowlingTeam, bowlingTeam: first.battingTeam }); next.currentInnings = 2; next.status = "awaiting_lineup"; next.pending = null; await saveMatch(next); navigate(`/matches/${matchId}/lineup/2`); };
  return <MatchShell><h1>Innings break</h1><p className="lead">{first.battingTeam} finished on {first.score.runs}/{first.score.wickets}.</p><p>{first.bowlingTeam} need {first.score.runs + 1} to win.</p><button className="btn btn-primary" onClick={startSecondInnings}>Set second-innings lineup</button></MatchShell>;
}

export function ResultPage() {
  const { matchId } = useParams(); const [match, setMatch] = useState(); useEffect(() => { loadMatch(matchId).then(setMatch); }, [matchId]);
  if (!match) return <MatchShell>Loading result…</MatchShell>; const first = match.innings[1], second = match.innings[2];
  const result = second.score.runs > first.score.runs ? `${second.battingTeam} won by ${10 - second.score.wickets} wickets` : second.score.runs === first.score.runs ? "Match tied" : `${first.battingTeam} won by ${first.score.runs - second.score.runs} runs`;
  return <MatchShell><h1>Match complete</h1><p className="display-6">{result}</p><p>{first.battingTeam} {first.score.runs}/{first.score.wickets} · {second.battingTeam} {second.score.runs}/{second.score.wickets}</p><Link className="btn btn-primary" to={`/scorecard/${matchId}/full`}>View scorecard</Link></MatchShell>;
}
