import { get, onValue, ref, set } from "firebase/database";
import { firebase as database } from "../../../components/firebase";

const matchRef = (matchId) => ref(database, `matches/${matchId}`);
export const saveMatch = (match) => set(matchRef(match.id), match);
export const loadMatch = async (matchId) => (await get(matchRef(matchId))).val();
export const watchMatch = (matchId, callback) => onValue(matchRef(matchId), (snapshot) => callback(snapshot.val()));
