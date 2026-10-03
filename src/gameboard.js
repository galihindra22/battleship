import { Ship } from "./ship.js"

class Gameboard {
    constructor() {
        this.board = {};
        this.ships = [];
        this.missedShots = [];
    }
    placeShip(x, y, ship) {
        this.ships.push(ship);
        for (let i = 0; i < ship.length; i++) {
            const key = `${x + i},${y}`;
            this.board[key] = ship;
        }
    }
    getShipAt(x, y) {
        const key = `${x},${y}`;
        return this.board[key] || null;
    }
    receiveAttack(x, y) {
        const targetShip = this.getShipAt(x, y);

        if (targetShip) targetShip.hit();

        else this.missedShots.push([x, y]);
    }
    allSunk(){
        if (this.ships.length === 0) return false;
        return this.ships.every(ship => ship.isSunk());
    }
}

export { Gameboard };