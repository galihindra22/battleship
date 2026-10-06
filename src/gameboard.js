class Gameboard {
  constructor() {
    this.board = {};
    this.ships = [];
    this.missedShots = [];
    this.successfulShots = [];
  }
  placeShip(x, y, ship, isHorizontal) {
    const coordinates = [];
    for (let i = 0; i < ship.length; i++) {
      const currentX = isHorizontal ? x + i : x;
      const currentY = isHorizontal ? y : y + i;

      if (currentX < 0 || currentX >= 10 || currentY < 0 || currentY >= 10) {
        return false;
      }

      const key = `${currentX},${currentY}`;
      if (this.board[key]) {
        return false;
      }
      coordinates.push(key);
    }

    this.ships.push(ship);
    coordinates.forEach((key) => {
      this.board[key] = ship;
    });

    return true;
  }
  getShipAt(x, y) {
    const key = `${x},${y}`;
    return this.board[key] || null;
  }
  receiveAttack(x, y) {
    const alreadyMissed = this.missedShots.some(
      ([missX, missY]) => missX === x && missY === y
    );
    const alreadyHit = this.successfulShots.some(
      ([hitX, hitY]) => hitX === x && hitY === y
    );

    if (alreadyMissed || alreadyHit) return false;

    const targetShip = this.getShipAt(x, y);

    if (targetShip) {
      targetShip.hit();
      this.successfulShots.push([x, y]);
    } else this.missedShots.push([x, y]);
    return true;
  }
  allSunk() {
    if (this.ships.length === 0) return false;
    return this.ships.every((ship) => ship.isSunk());
  }
}

export { Gameboard };
