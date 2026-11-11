import { createInnings } from "./scoringEngine";

export function createMatch({ ownerId, homeTeam, awayTeam, oversPerInnings, tossWinner, tossDecision }) {
  const firstBattingTeam = tossDecision === "bat" ? tossWinner : tossWinner === homeTeam ? awayTeam : homeTeam;
  const secondBattingTeam = firstBattingTeam === homeTeam ? awayTeam : homeTeam;
  const id = `${ownerId}_${Date.now()}`;
  return {
    id, ownerId, createdAt: Date.now(), oversPerInnings: Number(oversPerInnings),
    teams: { home: homeTeam.trim(), away: awayTeam.trim() }, toss: { winner: tossWinner, decision: tossDecision },
    innings: { 1: createInnings({ number: 1, battingTeam: firstBattingTeam, bowlingTeam: secondBattingTeam }) },
    currentInnings: 1, status: "awaiting_lineup", pending: null,
  };
}
