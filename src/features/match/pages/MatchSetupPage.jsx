import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../components/firebase";
import MatchShell from "../components/MatchShell";
import { createMatch } from "../services/matchFactory";
import { saveMatch } from "../services/matchRepository";

export default function MatchSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ homeTeam: "", awayTeam: "", overs: 20, tossWinner: "", tossDecision: "bat" });
  const change = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (!form.homeTeam.trim() || !form.awayTeam.trim() || !form.tossWinner) return;
    const match = createMatch({ ownerId: auth.currentUser.uid, homeTeam: form.homeTeam, awayTeam: form.awayTeam, oversPerInnings: form.overs, tossWinner: form.tossWinner, tossDecision: form.tossDecision });
    await saveMatch(match);
    navigate(`/matches/${match.id}/lineup/1`);
  };
  return <MatchShell><h1>Start a match</h1><p className="text-muted">Set the match once; the scorer persists every ball from there.</p>
    <form onSubmit={submit} className="card card-body shadow-sm gap-3">
      <input required className="form-control" placeholder="Home team" value={form.homeTeam} onChange={change("homeTeam")} />
      <input required className="form-control" placeholder="Away team" value={form.awayTeam} onChange={change("awayTeam")} />
      <label>Overs per innings<input required min="1" max="50" type="number" className="form-control" value={form.overs} onChange={change("overs")} /></label>
      <fieldset><legend className="fs-6">Toss winner</legend>{[form.homeTeam, form.awayTeam].filter(Boolean).map((team) => <label className="me-3" key={team}><input required type="radio" name="winner" value={team} checked={form.tossWinner === team} onChange={change("tossWinner")} /> {team}</label>)}</fieldset>
      <fieldset><legend className="fs-6">Decision</legend><label className="me-3"><input type="radio" checked={form.tossDecision === "bat"} onChange={() => setForm({ ...form, tossDecision: "bat" })} /> Bat</label><label><input type="radio" checked={form.tossDecision === "bowl"} onChange={() => setForm({ ...form, tossDecision: "bowl" })} /> Bowl</label></fieldset>
      <button className="btn btn-primary">Create match</button>
    </form></MatchShell>;
}
