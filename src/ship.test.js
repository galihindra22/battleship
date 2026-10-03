import { Ship } from "./ship.js";

test('hit() increases the number of hits on the ship', () => {
    const ship = new Ship(3);

    ship.hit();
    expect(ship.hits).toBe(1);

    ship.hit();
    expect(ship.hits).toBe(2);
});

test("isSunk() should return false when the number of hits is less than ship's length", () =>{
    const ship = new Ship(3);
    
    expect(ship.isSunk()).toBe(false);
});

test("isSunk() should return true when the number of hits is greater or equal to ship's length", () =>{
    const ship = new Ship(3);
    
    ship.hit();
    ship.hit();
    ship.hit();
    
    expect(ship.isSunk()).toBe(true);
});