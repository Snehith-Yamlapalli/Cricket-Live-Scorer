const playerId = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const ballLabel = (delivery) => {
  const parts = [];
  if (delivery.runs) parts.push(delivery.runs);
  if (delivery.extras?.wide) parts.push("Wd");
  if (delivery.extras?.noBall) parts.push("Nb");
  if (delivery.extras?.bye) parts.push("B");
  if (delivery.extras?.legBye) parts.push("Lb");
  if (delivery.wicket) parts.push("W");
  return parts.length ? parts.join("+") : "0";
};

const newBatter = (name) => ({ id: playerId(name), name: name.trim(), runs: 0, balls: 0, fours: 0, sixes: 0, out: false, retiredHurt: false });
const newBowler = (name) => ({ id: playerId(name), name: name.trim(), runs: 0, balls: 0, wickets: 0, maidens: 0 });

export function createInnings({ number, battingTeam, bowlingTeam }) {
  return {
    number, battingTeam, bowlingTeam,
    score: { runs: 0, wickets: 0, legalBalls: 0 },
    batters: {}, bowlers: {}, overs: [],
    current: null,
  };
}

export function setLineup(match, number, { striker, nonStriker, bowler }) {
  const next = structuredClone(match);
  const innings = next.innings[number];
  // Firebase does not retain empty objects, so initialise a brand-new innings
  // after loading it back from the database.
  innings.batters ||= {};
  innings.bowlers ||= {};
  innings.overs ||= [];
  const strikerData = newBatter(striker);
  const nonStrikerData = newBatter(nonStriker);
  const bowlerData = newBowler(bowler);
  if (strikerData.id === nonStrikerData.id) throw new Error("The two opening batters must be different.");
  innings.batters[strikerData.id] = strikerData;
  innings.batters[nonStrikerData.id] = nonStrikerData;
  innings.bowlers[bowlerData.id] = bowlerData;
  innings.current = { strikerId: strikerData.id, nonStrikerId: nonStrikerData.id, bowlerId: bowlerData.id };
  next.currentInnings = number;
  next.status = "live";
  next.pending = null;
  return next;
}

export function replaceBatter(match, name) {
  const next = structuredClone(match);
  const innings = next.innings[next.currentInnings];
  const batter = newBatter(name);
  if (innings.batters[batter.id]) throw new Error("That batter is already in this innings.");
  innings.batters[batter.id] = batter;
  if (next.pending.outgoingBatterId === innings.current.strikerId) innings.current.strikerId = batter.id;
  else innings.current.nonStrikerId = batter.id;
  const needsBowler = next.pending.needsBowler;
  next.pending = needsBowler ? { type: "bowler" } : null;
  next.status = needsBowler ? "needs_bowler" : "live";
  return next;
}

export function changeBowler(match, name) {
  const next = structuredClone(match);
  const innings = next.innings[next.currentInnings];
  const bowler = newBowler(name);
  if (bowler.id === innings.current.bowlerId) throw new Error("Choose a different bowler for the next over.");
  innings.bowlers[bowler.id] ||= bowler;
  innings.current.bowlerId = bowler.id;
  next.pending = null;
  next.status = "live";
  return next;
}

export function swapBatters(match) {
  const next = structuredClone(match);
  const current = next.innings[next.currentInnings].current;
  [current.strikerId, current.nonStrikerId] = [current.nonStrikerId, current.strikerId];
  return next;
}

export function retireHurt(match, batterId) {
  const next = structuredClone(match);
  const innings = next.innings[next.currentInnings];
  if (![innings.current.strikerId, innings.current.nonStrikerId].includes(batterId)) {
    throw new Error("Only one of the two active batters can retire hurt.");
  }
  innings.batters[batterId].retiredHurt = true;
  next.status = "needs_batter";
  next.pending = { type: "batter", outgoingBatterId: batterId, needsBowler: false, reason: "retired_hurt" };
  return next;
}

export function applyDelivery(match, input) {
  const next = structuredClone(match);
  const innings = next.innings[next.currentInnings];
  innings.overs ||= [];
  const { current } = innings;
  if (!current) throw new Error("Add a lineup before scoring.");
  const extras = input.extras || {};
  const batRuns = (extras.bye || extras.legBye) ? 0 : input.runs;
  const extraRuns = (extras.wide ? 1 : 0) + (extras.noBall ? 1 : 0) + ((extras.bye || extras.legBye) ? input.runs : 0);
  const totalRuns = batRuns + extraRuns;
  const legal = !extras.wide && !extras.noBall;
  const striker = innings.batters[current.strikerId];
  const bowler = innings.bowlers[current.bowlerId];
  const delivery = { runs: input.runs, extras, wicket: Boolean(input.wicket), legal, totalRuns };

  innings.score.runs += totalRuns;
  if (legal) { innings.score.legalBalls += 1; bowler.balls += 1; }
  striker.runs += batRuns;
  if (legal || extras.noBall) striker.balls += 1;
  if (batRuns === 4) striker.fours += 1;
  if (batRuns === 6) striker.sixes += 1;
  bowler.runs += totalRuns - ((extras.bye || extras.legBye) ? input.runs : 0);
  if (input.wicket) { innings.score.wickets += 1; striker.out = true; bowler.wickets += 1; }

  const overIndex = Math.floor((innings.score.legalBalls - (legal ? 1 : 0)) / 6);
  innings.overs[overIndex] ||= { bowlerId: bowler.id, deliveries: [] };
  innings.overs[overIndex].deliveries.push(delivery);

  if (totalRuns % 2) [current.strikerId, current.nonStrikerId] = [current.nonStrikerId, current.strikerId];
  const overFinished = legal && innings.score.legalBalls % 6 === 0;
  if (overFinished) [current.strikerId, current.nonStrikerId] = [current.nonStrikerId, current.strikerId];

  const target = next.currentInnings === 2 ? next.innings[1].score.runs + 1 : null;
  const inningsFinished = innings.score.legalBalls >= next.oversPerInnings * 6 || (target && innings.score.runs >= target) || innings.score.wickets >= 10;
  if (inningsFinished) {
    if (next.currentInnings === 1) { next.status = "innings_break"; next.pending = { type: "innings_break" }; }
    else { next.status = "completed"; next.pending = null; }
  } else if (input.wicket) {
    next.status = "needs_batter";
    next.pending = { type: "batter", outgoingBatterId: striker.out ? striker.id : current.strikerId, needsBowler: overFinished };
  } else if (overFinished) {
    next.status = "needs_bowler";
    next.pending = { type: "bowler" };
  }
  return next;
}
