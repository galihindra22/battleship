import { Gameboard } from "./gameboard.js";

class Player{
    constructor(type){
        this.type = type;
        this.gameboard = new Gameboard();
    }
    attack(x, y, gameboard){
        gameboard.receiveAttack(x, y);
    }
}

export {Player};