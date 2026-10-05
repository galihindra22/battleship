import { Player } from "./player.js";

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