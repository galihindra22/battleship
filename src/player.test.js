import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";

test('creates a player with a gameboard and type', () => {
    const player = new Player('player');
    const computer = new Player('computer');

    expect(player.type).toBe('player');
    expect(player.gameboard).toBeInstanceOf(Gameboard);
    expect(computer.type).toBe('computer');
});