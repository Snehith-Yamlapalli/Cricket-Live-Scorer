import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MatchShell from "../components/MatchShell";
import { watchMatch } from "../services/matchRepository";
const overs = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;
export default function ScorecardPage() {
  const { matchId } = useParams(); const [match, setMatch] = useState(); useEffect(() => watchMatch(matchId, setMatch), [matchId]); if (!match) return <MatchShell>Loading scorecard…</MatchShell>;
  return <MatchShell><div className="d-flex justify-content-between"><h1>Scorecard</h1><Link className="btn btn-outline-primary" to={`/scorecard/${matchId}`}>Live scorer</Link></div>{Object.values(match.innings).map((innings) => <Innings key={innings.number} innings={innings} />)}</MatchShell>;
}
function Innings({ innings }) { return <section className="card card-body mt-3"><h2 className="h4">{innings.battingTeam} <span className="float-end">{innings.score.runs}/{innings.score.wickets} ({overs(innings.score.legalBalls)})</span></h2><h3 className="h6 mt-3">Batting</h3><table className="table table-sm"><thead><tr><th>Player</th><th>R</th><th>B</th><th>4s</th><th>6s</th></tr></thead><tbody>{Object.values(innings.batters).map((p) => <tr key={p.id}><td>{p.name}{p.out ? " †" : p.retiredHurt ? " · retired hurt" : ""}</td><td>{p.runs}</td><td>{p.balls}</td><td>{p.fours}</td><td>{p.sixes}</td></tr>)}</tbody></table><h3 className="h6">Bowling</h3><table className="table table-sm"><thead><tr><th>Player</th><th>O</th><th>R</th><th>W</th></tr></thead><tbody>{Object.values(innings.bowlers).map((p) => <tr key={p.id}><td>{p.name}</td><td>{overs(p.balls)}</td><td>{p.runs}</td><td>{p.wickets}</td></tr>)}</tbody></table></section>; }
