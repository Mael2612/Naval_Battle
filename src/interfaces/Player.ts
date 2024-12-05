export default interface Player {
  name: string;
  playerBoard: string[][];
  opponentBoard: string[][];
  shipsLocations: string[];
  score: number;
}
