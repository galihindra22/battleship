import { Ship } from "./ship.js";

let targetQueue = [];
let originHit = null;
let currentDirection = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export function makeComputerMove(gameboard) {
    let x, y;
    let attackValid = false;

    if (targetQueue.length === 0) {
        originHit = null;
        currentDirection = null;
    }

    while (!attackValid) {
        if (targetQueue.length > 0) {
            [x, y] = targetQueue.shift();
        } else {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }

        const alreadyMissed = gameboard.missedShots.some(
            ([missX, missY]) => missX === x && missY === y
        );
        const alreadyHit = gameboard.successfulShots.some(
            ([hitX, hitY]) => hitX === x && hitY === y
        );

        if (!alreadyMissed && !alreadyHit) {
            attackValid = true;
        }
    }

    gameboard.receiveAttack(x, y);

    const wasHit = gameboard.successfulShots.some(
        ([hitX, hitY]) => hitX === x && hitY === y
    );

    if (wasHit) {
        if (!originHit) {
            originHit = [x, y];

            const potentialNeighbors = shuffleArray([
                [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
            ]);

            potentialNeighbors.forEach(([nX, nY]) => {
                if (nX >= 0 && nX < 10 && nY >= 0 && nY < 10) {
                    const isM = gameboard.missedShots.some(([mX, mY]) => mX === nX && mY === nY);
                    const isH = gameboard.successfulShots.some(([hX, hY]) => hX === nX && hY === nY);
                    const isQ = targetQueue.some(([qX, qY]) => qX === nX && qY === nY);

                    if (!isM && !isH && !isQ) {
                        targetQueue.push([nX, nY]);
                    }
                }
            });
        } else {
            const dx = Math.sign(x - originHit[0]);
            const dy = Math.sign(y - originHit[1]);
            currentDirection = [dx, dy];

            const nextX = x + dx;
            const nextY = y + dy;

            if (nextX >= 0 && nextX < 10 && nextY >= 0 && nextY < 10) {
                const isM = gameboard.missedShots.some(
                    ([mX, mY]) => mX === nextX && mY === nextY
                );
                const isH = gameboard.successfulShots.some(
                    ([hX, hY]) => hX === nextX && hY === nextY
                );

                if (!isM && !isH) {
                    targetQueue.unshift([nextX, nextY]);
                }
            }

            const reverseX = originHit[0] - dx;
            const reverseY = originHit[1] - dy;

            if (reverseX >= 0 && reverseX < 10 && reverseY >= 0 && reverseY < 10) {
                const isM = gameboard.missedShots.some(([mX, mY]) => mX === reverseX && mY === reverseY);
                const isH = gameboard.successfulShots.some(([hX, hY]) => hX === reverseX && hY === reverseY);

                if (!isM && !isH) {
                    targetQueue.push([reverseX, reverseY]);
                }
            }
        }
    } else if (currentDirection && originHit) {
        const [dx, dy] = currentDirection;
        const reverseX = originHit[0] - dx;
        const reverseY = originHit[1] - dy;

        if (reverseX >= 0 && reverseX < 10 && reverseY >= 0 && reverseY < 10) {
            const isM = gameboard.missedShots.some(([mX, mY]) => mX === reverseX && mY === reverseY);
            const isH = gameboard.successfulShots.some(([hX, hY]) => hX === reverseX && hY === reverseY);

            if (!isM && !isH) {
                targetQueue.unshift([reverseX, reverseY]);
            }
        }
    }
    return [x, y];
}
export function resetComputer() {
    targetQueue = [];
    originHit = null;
    currentDirection = null;
}
export function populateComputerBoard(gameboard) {
    const shipLenghts = [5, 4, 3, 2, 1];

    shipLenghts.forEach((length) => {
        let placed = false;
        while (!placed) {
            const isHorizontal = Math.random() < 0.5;

            const x = isHorizontal ?
                Math.floor(Math.random() * (10 - length + 1)) :
                Math.floor(Math.random() * 10);
            const y = isHorizontal ?
                Math.floor(Math.random() * (10 - length + 1)) :
                Math.floor(Math.random() * 10);

            const ship = new Ship(length);
            const success = gameboard.placeShip(x, y, ship, isHorizontal);

            if(success) placed = true;
        }
    });
}