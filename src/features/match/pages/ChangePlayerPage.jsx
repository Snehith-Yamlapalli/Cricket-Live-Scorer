import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MatchShell from "../components/MatchShell";
import { loadMatch, saveMatch } from "../services/matchRepository";
import { changeBowler, replaceBatter } from "../services/scoringEngine";

export default function ChangePlayerPage({ type }) {
  const { matchId } = useParams(); const navigate = useNavigate(); const [match, setMatch] = useState(); const [name, setName] = useState(""); const [error, setError] = useState("");
  useEffect(() => { loadMatch(matchId).then(setMatch); }, [matchId]);
  if (!match) return <MatchShell>Loading…</MatchShell>;
  const submit = async (event) => { event.preventDefault(); try { const next = type === "batter" ? replaceBatter(match, name) : changeBowler(match, name); await saveMatch(next); navigate(`/scorecard/${matchId}`); } catch (e) { setError(e.message); } };
  const innings = match.innings[match.currentInnings]; const outgoing = type === "batter" && innings.batters[match.pending.outgoingBatterId];
  const retiredHurt = match.pending?.reason === "retired_hurt";
  return <MatchShell><h1>New {type === "batter" ? "batter" : "bowler"}</h1><p>{outgoing ? retiredHurt ? `${outgoing.name} has retired hurt. Add the replacement batter.` : `${outgoing.name} is out. Add the incoming batter.` : `Choose the next bowler for ${innings.bowlingTeam}.`}</p>{error && <p className="text-danger">{error}</p>}<form className="card card-body shadow-sm gap-3" onSubmit={submit}><input autoFocus required className="form-control" placeholder={`Player name`} value={name} onChange={(e) => setName(e.target.value)} /><button className="btn btn-primary">Continue</button></form></MatchShell>;
}
