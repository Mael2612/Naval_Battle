import { displayScores, displayEndOfGame } from './displayLib';
import { playGame } from './gameLib';

const readlineSync = require('readline-sync');

const playerIsPlaying: boolean = true;

function displayLevelMenu(): void {
  while (playerIsPlaying) {
    const level: string[] = ['Facile', 'Moyen', 'Difficile', 'Retour', 'Quitter'];
    let iCopy: number = 0;
    for (let i = 0; i < level.length; i += 1) {
      console.log(`[${iCopy += 1}] ${level[i]}`);
    }
    const option: string = readlineSync.question('level : ');
    if (parseInt(option, 10) >= 1 && parseInt(option, 10) <= level.length) {
      if (option === '1') {
        playGame(1);
      } else if (option === '2') {
        playGame(2);
      } else if (option === '3') {
        playGame(3);
      } else if (option === '4') {
        return;
      } else {
        displayEndOfGame();
      }
    } else {
      console.log('Veuillez entrer une option valide');
    }
  }
}

function displayMenu(): void {
  process.stdout.write('\x1Bc');
  while (playerIsPlaying) {
    const menu: string[] = ['Jouer', 'Quitter'];
    let iCopy: number = 0;
    for (let i = 0; i < menu.length; i += 1) {
      console.log(`[${iCopy += 1}] ${menu[i]}`);
    }
    const option: string = readlineSync.question('menu : ');
    if (parseInt(option, 10) >= 1 && parseInt(option, 10) <= menu.length) {
      if (option === '1') {
        displayLevelMenu();
      } else if (option === '2') {
        displayScores();
      } else {
        displayEndOfGame();
      }
    } else {
      console.log('Veuillez entrer une option valide');
    }
  }
}

export default displayMenu;
