import './styles.css';
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { makeComputerMove } from './computer.js'

const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");

const player = new Player('player');
const computer = new Player('computer');

player.gameboard.placeShip(2, 3, new Ship(8));
computer.gameboard.placeShip(0, 0, new Ship(3));

function renderBoard(gameboard, container, isEnemy) {
    container.innerHTML = '';

    const gridSize = 10;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.dataset.x = x;
            cell.dataset.y = y;

            const ship = gameboard.getShipAt(x, y);

            const isMiss = gameboard.missedShots.some(
                ([missX, missY]) => missX === x && missY === y
            );

            const isHit = gameboard.successfulShots.some(
                ([hitX, hitY]) => hitX === x && hitY === y
            );

            if (isMiss) {
                cell.classList.add('miss');
            } else if (isHit) {
                cell.classList.add('hit');
            } else if (ship && !isEnemy) {
                cell.classList.add('ship');
            }

            container.appendChild(cell);
        }
    }
}

function updateUI() {
    renderBoard(player.gameboard, playerBoard, false);
    renderBoard(computer.gameboard, computerBoard, true);
}

updateUI();

computerBoard.addEventListener("click", (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    //player turn
    const previousPlayerHits = computer.gameboard.successfulShots.length;
    const isAttackValid = computer.gameboard.receiveAttack(x, y);
    if (!isAttackValid) return;

    const playerHit = computer.gameboard.successfulShots.length > previousPlayerHits;

    //wincon
    if (computer.gameboard.allSunk()) {
        alert('Victory!');
        updateUI();
        return;
    }

    if (playerHit){
        updateUI();
        return;
    }

    //computer turn
    let computerTurn = true;

    while (computerTurn) {
        const previousComputerHits = player.gameboard.successfulShots.length;

        makeComputerMove(player.gameboard);

        const computerHit = player.gameboard.successfulShots.length > previousComputerHits;

        updateUI();

        if (player.gameboard.allSunk()) {
            alert('Game Over! The computer sunk all your ships!');
            updateUI();
        }

        if (!computerHit) {
            computerTurn = false;
        }
    }
});