import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MatchShell from "../components/MatchShell";
import { saveMatch, watchMatch } from "../services/matchRepository";
import { applyDelivery, ballLabel, retireHurt, swapBatters } from "../services/scoringEngine";

const initialEvent = { runs: 0, extras: {}, wicket: false };
const overs = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

export default function ScorerPage() {
  const { matchId } = useParams(); const navigate = useNavigate(); const [match, setMatch] = useState(); const [event, setEvent] = useState(initialEvent); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => watchMatch(matchId, setMatch), [matchId]);
  if (!match) return <MatchShell>Loading scorer…</MatchShell>;
  const innings = match.innings[match.currentInnings];
  if (match.status === "awaiting_lineup") { navigate(`/matches/${matchId}/lineup/${match.currentInnings}`, { replace: true }); return null; }
  if (match.status === "needs_batter") { navigate(`/matches/${matchId}/change-batter`, { replace: true }); return null; }
  if (match.status === "needs_bowler") { navigate(`/matches/${matchId}/change-bowler`, { replace: true }); return null; }
  if (match.status === "innings_break") { navigate(`/matches/${matchId}/innings-break`, { replace: true }); return null; }
  if (match.status === "completed") { navigate(`/matches/${matchId}/result`, { replace: true }); return null; }
  const striker = innings.batters[innings.current.strikerId], nonStriker = innings.batters[innings.current.nonStrikerId], bowler = innings.bowlers[innings.current.bowlerId];
  const toggleExtra = (key) => { const extras = { ...event.extras }; if (extras[key]) delete extras[key]; else { ["wide", "noBall", "bye", "legBye"].forEach((type) => delete extras[type]); extras[key] = true; } setEvent({ ...event, extras }); };
  const score = async (runs) => { setSaving(true); setError(""); try { await saveMatch(applyDelivery(match, { ...event, runs })); setEvent(initialEvent); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  const saveTransition = async (transition) => { setSaving(true); setError(""); try { await saveMatch(transition(match)); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  // Firebase removes empty arrays, so there is no `overs` value before the
  // first delivery has been recorded.
  const latestOver = (innings.overs || []).at(-1);
  // After an over ends, its deliveries remain in history. A newly selected
  // bowler has not bowled any balls yet, so do not show the previous bowler's
  // completed over as the new over.
  const recent = latestOver?.bowlerId === innings.current.bowlerId ? latestOver.deliveries : [];
  return <MatchShell><section className="score-hero"><div className="d-flex justify-content-between gap-3 align-items-start"><div><div className="score-kicker">Innings {match.currentInnings} · {innings.battingTeam}</div><div className="score-total">{innings.score.runs}<small>/{innings.score.wickets}</small></div><div className="score-meta">{overs(innings.score.legalBalls)} overs · vs {innings.bowlingTeam}</div></div><Link className="scorecard-link" to={`/scorecard/${matchId}/full`}>Full scorecard</Link></div></section>
    <section className="player-strip"><Player title="Striker" player={striker} active /><Player title="Non-striker" player={nonStriker} /><Player title="Bowler" player={bowler} bowling /></section>
    <section className="batter-actions"><button disabled={saving} className="btn btn-outline-dark" onClick={() => saveTransition(swapBatters)}>⇄ Swap batters</button><button disabled={saving} className="btn btn-outline-danger" onClick={() => saveTransition((currentMatch) => retireHurt(currentMatch, striker.id))}>Retire {striker.name}</button><button disabled={saving} className="btn btn-outline-danger" onClick={() => saveTransition((currentMatch) => retireHurt(currentMatch, nonStriker.id))}>Retire {nonStriker.name}</button></section>
    <section className="over-card"><div className="over-title"><span>This over</span><span>{recent.length} event{recent.length === 1 ? "" : "s"}</span></div><div>{recent.length ? recent.map((ball, i) => <span className="delivery-chip" key={i}>{ballLabel(ball)}</span>) : <span className="delivery-chip empty">Waiting for ball one</span>}</div></section>
    <section className="scoring-panel"><div className="scoring-heading"><h2>Record delivery</h2><span>{saving ? "Saving…" : "Choose the outcome"}</span></div>{error && <p className="text-danger">{error}</p>}<div className="event-options">{["wide", "noBall", "bye", "legBye"].map((key) => <label className="event-option" key={key}><input type="checkbox" checked={Boolean(event.extras[key])} onChange={() => toggleExtra(key)} /><span>{key === "noBall" ? "No ball" : key === "legBye" ? "Leg bye" : key}</span></label>)}<label className="event-option"><input type="checkbox" checked={event.wicket} onChange={(e) => setEvent({ ...event, wicket: e.target.checked })} /><span>Wicket</span></label></div><div className="run-pad">{[0, 1, 2, 3, 4, 5, 6].map((runs) => <button disabled={saving} className="btn btn-primary" onClick={() => score(runs)} key={runs}>{runs}</button>)}</div></section>
  </MatchShell>;
}
function Player({ title, player, active, bowling }) { return <div className={`player-card${active ? " active" : ""}`}><span className="player-label">{title}{active && " · on strike"}</span><div className="player-name">{player.name}</div><div className="player-stats">{bowling ? `${overs(player.balls)} · ${player.runs}/${player.wickets}` : `${player.runs} (${player.balls}) · 4s ${player.fours}, 6s ${player.sixes}`}</div></div>; }
