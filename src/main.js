import './styles.css';
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { makeComputerMove, populateComputerBoard } from './computer.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const shipDiv = document.querySelector(".ships");
const setupContainer = document.querySelector(".setup-container");
const rotateBtn = document.querySelector("#rotate-btn");
const startBtn = document.querySelector("#start-btn");

const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");

const player = new Player('player');
const computer = new Player('computer');

let isHorizontal = true;
let draggedShipLength = null;
let draggedShipElement = null;
let gameStarted = false;

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

computerBoard.style.pointerEvents = 'none';
updateUI();

rotateBtn.addEventListener("click", () => {
    isHorizontal = !isHorizontal;
    rotateBtn.textContent = `Axis: ${isHorizontal ? 'Horizontal' : 'Vertical'}`;
});

shipDiv.addEventListener('dragstart', (e) => {
    const shipEl = e.target.closest('.draggable-ship');
    if (!shipEl) return;

    draggedShipElement = shipEl;
    draggedShipLength = Number(shipEl.dataset.length);
    e.dataTransfer.setData('text/plain', draggedShipLength)
});

playerBoard.addEventListener('dragover', (e) => {
    e.preventDefault();
});

playerBoard.addEventListener('dragenter', (e) => {
    const cell = e.target.closest(".cell");
    if (cell) cell.classList.add('drag-over');
});

playerBoard.addEventListener('dragleave', (e) => {
    const cell = e.target.closest(".cell");
    if (cell) cell.classList.remove('drag-over');
});

playerBoard.addEventListener('drop', (e) => {
    e.preventDefault();
    const cell = e.target.closest('.cell');
    if (!cell || !draggedShipLength) return;

    cell.classList.remove('drag-over');

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const ship = new Ship(draggedShipLength);
    const success = player.gameboard.placeShip(x, y, ship, isHorizontal);

    if (success) {
        draggedShipElement.remove();
        draggedShipElement = null;
        draggedShipLength = null;

        updateUI();

        if (shipDiv.children.length === 0) startBtn.disabled = false;
    }
});

startBtn.addEventListener("click", () => {
    gameStarted = true;
    populateComputerBoard(computer.gameboard);

    setupContainer.style.display = 'none';
    computerBoard.style.pointerEvents = 'auto';

    updateUI();
});

computerBoard.addEventListener("click", async (e) => {
    if (!gameStarted) return;

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

    if (playerHit) {
        updateUI();
        return;
    }

    updateUI();

    computerBoard.style.pointerEvents = 'none';

    //computer turn
    let computerTurn = true;

    while (computerTurn) {

        await sleep(300);

        const previousComputerHits = player.gameboard.successfulShots.length;

        makeComputerMove(player.gameboard);

        const computerHit = player.gameboard.successfulShots.length > previousComputerHits;

        updateUI();

        if (player.gameboard.allSunk()) {
            alert('Game Over!');
            computerBoardElement.style.pointerEvents = 'none';
            updateUI();
            return;
        }

        if (!computerHit) {
            computerTurn = false;
        }
    }
    computerBoard.style.pointerEvents = 'auto';
});