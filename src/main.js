import './styles.css';
import { Player } from "./player.js";
import { Ship } from "./ship.js";

const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");

const player = new Player('player');
const computer = new Player('computer');
const ship1 = new Ship(3);
const ship2 = new Ship(3);

player.gameboard.placeShip(2, 3, ship1);
computer.gameboard.placeShip(0, 0, ship2);

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
                ([hX, hY]) => hX === x && hY === y
            );

            if (isMiss) {
                cell.classList.add('miss');
            } else if (isHit) {
                cell.classList.add('hit');
            }else if (ship && !isEnemy){
                cell.classList.add('ship');
            }

            container.appendChild(cell);
        }
    }
}

function updateUI(){
    renderBoard(player.gameboard, playerBoard, false);
    renderBoard(computer.gameboard, computerBoard, true);
}

updateUI();

computerBoard.addEventListener("click", (e) =>{
    const cell = e.target.closest('.cell');
    if(!cell) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const isAttackValid = computer.gameboard.receiveAttack(x, y);
    if(!isAttackValid) return;
    
    if(computer.gameboard.allSunk()){
        alert('Victory!');
    }

    updateUI();
});