import { Ship } from "./ship.js";

test('hit() increases the number of hits on the ship', () => {
    const ship = new Ship(3);

    ship.hit();
    expect(ship.hits).toBe(1);

    ship.hit();
    expect(ship.hits).toBe(2);
});