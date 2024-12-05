import { generateRandomNumber } from '../utils/utils';
import { initPlayers } from './player';
import { placeShipsOnBoard, displayBoard } from './board';
import Player from '../interfaces/Player';

const readlineSync = require('readline-sync');

export function getPlayersInfos(currentPlayerInfos: Player, opponentPlayerInfos: Player): any {
  return { currentPlayerInfos, opponentPlayerInfos };
}

function initQuantityOfShip(): number {
  const optionOnNumberOfShip: string[] = ['Aléatoire', 'Faire mon choix'];

  let option: string = '';
  const optionRegExp: RegExp = /^[1-2]$/;
  while (!optionRegExp.test(option)) {
    let index: number = 0;
    for (let i: number = 0; i < optionOnNumberOfShip.length; i += 1) {
      console.log(`[${index += 1}] ${optionOnNumberOfShip[i]}`);
    }
    option = readlineSync.question('option : ');
    if (option === '1') {
      const numberOfShipRandom: number = generateRandomNumber();
      console.log(`Vous aurez ${numberOfShipRandom} à placer sur votre plateau`);
      return numberOfShipRandom;
    }
    let playerChoice: string = '';
    const PlayerChoiceRegExp = /^(1[0-5]|[5-9])$/;
    while (!PlayerChoiceRegExp.test(playerChoice)) {
      console.log('Choississez un nombre compris entre 5 et 15');
      playerChoice = readlineSync.question(' : ');
      if (parseInt(playerChoice, 10) >= 5 && parseInt(playerChoice, 10) <= 15) {
        return parseInt(playerChoice, 10);
      }
      console.log('Erreur: Réessayez ! Uniquement des chiffres compris entre 5 et 15 !');
    }
  }
  return 5;
}
function attackOpponent(currentPlayerInfos: Player, opponentPlayer: Player): boolean {
  console.log(`La carte du capitaine ${opponentPlayer.name}`);
  displayBoard(currentPlayerInfos.opponentBoard);
  console.log('============================================================');
  console.log(`Notre plan de bataille capitaine ${currentPlayerInfos.name}`);
  displayBoard(currentPlayerInfos.playerBoard);

  const shipsLocations: string[] = [];
  const attackPlan: boolean = placeShipsOnBoard('--attack', currentPlayerInfos.opponentBoard, 1, shipsLocations, currentPlayerInfos, opponentPlayer).attackSuccess;
  return attackPlan;
}

export function playGame(level:number) {
  let numberOfShip: number;
  let players: any = {};
  if (level === 1) {
    numberOfShip = initQuantityOfShip();
    players = initPlayers(8, numberOfShip);
  } else if ((level === 2)) {
    numberOfShip = initQuantityOfShip();
    players = initPlayers(12, numberOfShip);
  } else {
    numberOfShip = initQuantityOfShip();
    players = initPlayers(16, numberOfShip);
  }

  const { player1 } = players;
  const { player2 } = players;
  let currentPlayer: Player = player1;
  let opponentPlayer: Player = player2;

  while (player1.shipsLocations.length > 0 || player2.shipsLocations.length > 0) {
    console.log(`${currentPlayer.name}, c'est votre tour !`);

    const hit = attackOpponent(currentPlayer, opponentPlayer);
    if (hit) {
      console.log('Bravo ! Vous avez touché un bateau ! Vous rejouez.');
    } else {
      console.log('Manqué ! Changement de tour.');
      [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
    }

    if (player1.shipsLocations.length === 0) {
      console.log(`${player2.name} a gagné !`);
      return;
    } if (player2.shipsLocations.length === 0) {
      console.log(`${player1.name} a gagné !`);
      return;
    }
  }
}
