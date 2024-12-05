import Player from '../interfaces/Player';
import { createABoard, placeShipsOnBoard } from './board';

const readlineSync = require('readline-sync');

export function createAPlayer(order: number, boardSize: number, numberOfShipToPlace: number): any {
  process.stdout.write('\x1Bc');
  console.log(`Création du jouer n°${order}`);
  const userNameRegex = /^[a-zA-Z0-9_-]+$/;
  let playerName: string = '';
  let goodUserName: boolean = false;
  while (!goodUserName) {
    console.log('Comment vous appeler vous ?');
    playerName = readlineSync.question('username : ');
    if (playerName.length < 3 || playerName.includes(' ') || !userNameRegex.test(playerName)) {
      console.log('Votre username dois contenir : ');
      console.log('- 3 caractères minimum ');
      console.log('- A - Z ou a - z | 0 - 9 | - _  | 3 caratères minimum');
      console.log('- les espaces ne sont pas accepté ');
      goodUserName = false;
    } else {
      goodUserName = true;
      process.stdout.write('\x1Bc');
      console.log(`Ravie de vous rencontrer capitaine ${playerName}!!`);
    }
  }

  const playerBoard: string[][] = createABoard(boardSize);
  const shipsLocations: string[] = [];

  const playerInitialized: any = placeShipsOnBoard('--add', playerBoard, numberOfShipToPlace, shipsLocations, undefined, undefined);

  const playerInfos: Player = {
    name: playerName,
    playerBoard: playerInitialized.board,
    opponentBoard: createABoard(boardSize),
    shipsLocations: playerInitialized.shipsLocations,
    score: numberOfShipToPlace,
  };
  return playerInfos;
}

export function initPlayers(boardSize: number, numberOfShipToPlace: number) {
  const player1: Player = createAPlayer(1, boardSize, numberOfShipToPlace);
  const player2: Player = createAPlayer(2, boardSize, numberOfShipToPlace);

  return { player1, player2 };
}
