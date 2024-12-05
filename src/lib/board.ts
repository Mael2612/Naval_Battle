import Player from '../interfaces/Player';
import { generateRegex } from '../utils/utils';

const readlineSync = require('readline-sync');

export function createABoard(boardSize: number): string[][] {
  const board: string[][] = [];
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push('.');
    }
  }

  return board;
}

export function displayBoard(board: string[][]): void {
  const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const lineLetter: string[] = [];
  let lineNumber: number = 0;
  for (let i: number = 0; i < board.length; i += 1) {
    lineLetter.push(`${lineNumber += 1}`);
  }

  const columnLetter: string[] = [];
  for (let j: number = 0; j < board.length; j += 1) {
    columnLetter.push(alphabet[j]);
  }

  const bigBoard: string = board.length > 9 ? ' ' : '';
  console.log(`    ${bigBoard}${columnLetter.join(' ')}`);
  for (let k = 0; k < board.length; k += 1) {
    console.log(`${lineLetter[k]} ${k <= 8 ? bigBoard : ''}[ ${board[k].join(' ')} ]`);
  }
}

function findCommandOnBoard(
  event: string,
  board: string[][],
  column: string,
  line: string,
  cPlayerInfos: Player,
  oPlayerInfos: Player,
) {
  const alphabet: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];

  column = column.toUpperCase();
  const y: number = alphabet.indexOf(column);
  const x: number = (parseInt(line, 10) - 1);

  if (event === '--attack') {
    const opponentBoard: string[][] = oPlayerInfos.playerBoard;

    if (opponentBoard[x][y] === 'X') {
      oPlayerInfos.playerBoard[x][y] = '@';
      cPlayerInfos.opponentBoard[x][y] = '@';
      oPlayerInfos.score -= 1;
      cPlayerInfos.score += 1;
      oPlayerInfos.shipsLocations = oPlayerInfos.shipsLocations.filter(
        (e) => e !== column.concat(line),
      );
      const success: boolean = true;
      return { success };
    }
    oPlayerInfos.playerBoard[x][y] = 'O';
    cPlayerInfos.opponentBoard[x][y] = 'O';
    cPlayerInfos.score -= 1;
    const success: boolean = false;
    return { success };
  } if (event === '--add') {
    board[x][y] = 'X';
  }
  return { board };
}

function askForValidLocation(event : string, boardLength: number, shipNumber: number): string {
  const alphabet: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];

  const regex: RegExp = generateRegex(boardLength, alphabet[boardLength - 1]);
  let location: string = '';

  if (event === '--add') {
    console.log('Où voulez-vous placer votre bateau ?');
    location = readlineSync.question(`Bateau n°${shipNumber} : `);
  } else if (event === '--attack') {
    console.log('Quel emplacement allez-vous attaquer capitaine ?');
    location = readlineSync.question(`Attaquer le n°${shipNumber} : `);
  }

  if (!regex.test(location)) {
    console.log('Capitaine, nous ne comprenons pas votre commande ! Crier plus fort !');
    return 'Z99';
  }

  return location;
}

export function placeShipsOnBoard(
  event: string,
  board: string[][],
  numberOfShipToPlace: number,
  shipsLocations: string[],
  currentPlayerInfos: Player | undefined,
  opponentPlayerInfos: Player | undefined,
) {
  let attackSuccess: boolean = true;
  if (event === '--add') {
    console.log('Voici votre plateau il est encore vide, Vous devez y placer vos bâteaux de guerre');
    console.log('Chacunes des colonnes correspond à une lettre de l`\'alphabet');
    console.log('Chacune des lignes correspond à un numméro');
    console.log('EXEMPLE: si je souhaite placer un bateau sur la première ligne dans la première colonne');
    console.log('Je tape : A1');
    displayBoard(board);
    console.log(`Vous pourrez placer jusqu'à ${numberOfShipToPlace} bateaux dans votre flotte capitaine`);
  } else if (event === '--attack') {
    console.log('À l\'attaque CAPITAINE !!!');
  }
  let shipPlaced: number = 1;
  while (shipPlaced <= numberOfShipToPlace) {
    let location: any;
    if (event === '--add') {
      location = askForValidLocation('--add', board.length, shipPlaced);
    } else if (event === '--attack') {
      location = askForValidLocation('--attack', board.length, shipPlaced);
    }

    if (location === 'Z99') {
      console.log('Entrez une valeur valide');
    } else if (shipsLocations.includes(location) === true) {
      console.log(`Mon capitaine un navire ce trouve déjà a l'emplacement : ${location}`);
    } else {
      shipsLocations.push(location);
      const columnLocation: string = location[0];
      const lineLocationVal1: string = location[1];
      const lineLocationVal2: string | undefined = location[2];

      if (event === '--add') {
        if (board.length >= 12 && lineLocationVal2 !== undefined) {
          const lineConcat = lineLocationVal1 + lineLocationVal2;
          board = findCommandOnBoard('--add', board, columnLocation, lineConcat, currentPlayerInfos!, opponentPlayerInfos!).board!;
          displayBoard(board);
        } else {
          board = findCommandOnBoard('--add', board, columnLocation, lineLocationVal1, currentPlayerInfos!, opponentPlayerInfos!).board!;
          displayBoard(board);
        }
      } else if (event === '--attack') {
        if (board.length >= 12 && lineLocationVal2 !== undefined) {
          const lineConcat = lineLocationVal1 + lineLocationVal2;
          attackSuccess = findCommandOnBoard('--attack', board, columnLocation, lineConcat, currentPlayerInfos!, opponentPlayerInfos!).success!;
        } else {
          attackSuccess = findCommandOnBoard('--attack', board, columnLocation, lineLocationVal1, currentPlayerInfos!, opponentPlayerInfos!).success!;
        }
      }

      shipPlaced += 1;
    }
  }

  return {
    board, shipsLocations, currentPlayerInfos, opponentPlayerInfos, attackSuccess,
  };
}
