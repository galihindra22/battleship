import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js"
import { Player } from './player';

test('hit() increases the number of hits on the ship', () => {
    const ship = new Ship(3);

    ship.hit();
    expect(ship.hits).toBe(1);

    ship.hit();
    expect(ship.hits).toBe(2);
});

test("isSunk() should return false when the number of hits is less than ship's length", () => {
    const ship = new Ship(3);

    expect(ship.isSunk()).toBe(false);
});

test("isSunk() should return true when the number of hits is greater or equal to ship's length", () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
});

test("Place a ship at specific coordinate", () => {
    const board = new Gameboard();
    const ship = new Ship(3);

    board.placeShip(0, 0, ship);

    expect(board.getShipAt(0, 0)).toBe(ship);
});

test("receiveAttack() hits the ship at the target coordinates", () => {
    const board = new Gameboard();
    const ship = new Ship(3);

    board.placeShip(0, 0, ship);
    board.receiveAttack(0, 0);

    expect(ship.hits).toBe(1);
});

test("receiveAttack() records missed attacks", () => {
    const board = new Gameboard();

    board.receiveAttack(5, 5);

    expect(board.missedShots).toContainEqual([5, 5]);
});

test("allSunk() returns true when all ships sunk", () => {
    const board = new Gameboard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    board.placeShip(0, 0, ship1);
    board.placeShip(0, 2, ship2);

    //sink ship1
    board.receiveAttack(0, 0);
    board.receiveAttack(1, 0);
    board.receiveAttack(2, 0);

    //sink ship2
    board.receiveAttack(0, 2);
    board.receiveAttack(1, 2);

    expect(board.allSunk()).toBe(true);
});

test('creates a player with a gameboard and type', () => {
    const player = new Player('player');
    const computer = new Player('computer');

    expect(player.type).toBe('player');
    expect(player.gameboard).toBeInstanceOf(Gameboard);
    expect(computer.type).toBe('computer');
});

test('player can attack an opponent board', () => {
    const player = new Player('real');
    const computer = new Player('computer');

    player.attack(0, 0, computer.gameboard);

    expect(computer.gameboard.missedShots).toContainEqual([0, 0]);
});