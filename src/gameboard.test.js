import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js"

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

    board.placeShip(0, 0, ship1, true);
    board.placeShip(0, 2, ship2, true);

    //sink ship1
    board.receiveAttack(0, 0);
    board.receiveAttack(1, 0);
    board.receiveAttack(2, 0);

    //sink ship2
    board.receiveAttack(0, 2);
    board.receiveAttack(1, 2);

    expect(board.allSunk()).toBe(true);
});