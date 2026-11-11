import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MatchShell from "../components/MatchShell";
import { loadMatch, saveMatch } from "../services/matchRepository";
import { setLineup } from "../services/scoringEngine";

export default function LineupPage() {
  const { matchId, innings: inningsParam } = useParams(); const inningsNumber = Number(inningsParam); const navigate = useNavigate();
  const [match, setMatch] = useState(); const [form, setForm] = useState({ striker: "", nonStriker: "", bowler: "" }); const [error, setError] = useState("");
  useEffect(() => { loadMatch(matchId).then(setMatch); }, [matchId]);
  if (!match) return <MatchShell>Loading match…</MatchShell>;
  const innings = match.innings[inningsNumber];
  const submit = async (event) => { event.preventDefault(); try { const next = setLineup(match, inningsNumber, form); await saveMatch(next); navigate(`/scorecard/${matchId}`); } catch (e) { setError(e.message); } };
  return <MatchShell><h1>Innings {inningsNumber} lineup</h1><p>{innings.battingTeam} batting · {innings.bowlingTeam} bowling</p>{error && <p className="text-danger">{error}</p>}
    <form onSubmit={submit} className="card card-body shadow-sm gap-3">{[["striker", "Striker"], ["nonStriker", "Non-striker"], ["bowler", "Opening bowler"]].map(([key, label]) => <label key={key}>{label}<input required className="form-control" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}<button className="btn btn-primary">Begin innings</button></form>
  </MatchShell>;
}
