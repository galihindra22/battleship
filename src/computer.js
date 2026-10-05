let targetQueue = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export function makeComputerMove(gameboard) {
    let x, y;
    let successfulAttack = false;

    while (!successfulAttack) {
        if (targetQueue.length > 0) {
            const nextTarget = targetQueue.shift();
            if (nextTarget && typeof nextTarget[0] === 'number' && typeof nextTarget[1] === 'number') {
                [x, y] = nextTarget;
            } else {
                continue;
            }
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
            successfulAttack = true;
        }
    }

    gameboard.receiveAttack(x, y);

    const wasHit = gameboard.successfulShots.some(
        ([hitX, hitY]) => hitX === x && hitY === y
    );

    if (wasHit) {
        const neighbors = [
            [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y],
        ];
        
        const randomizedNeighbors = shuffleArray(neighbors);

        randomizedNeighbors.forEach(([nX, nY]) => {
            if (nX >= 0 && nX < 10 && nY >= 0 && nY < 10) {
                const isMissed = gameboard.missedShots.some(
                    ([mX, mY]) => mX === nX && mY === nY
                );
                const isHit = gameboard.successfulShots.some(
                    ([hX, hY]) => hX === nX && hY === nY
                );
                const isQueued = targetQueue.some(
                    ([qX, qY]) => qX === nX && qY === nY
                );

                if (!isMissed && !isHit && !isQueued) {
                    targetQueue.push([nX, nY]);
                }
            }
        });
    }
    return [x, y];
}

export function resetComputer() {
    targetQueue = [];
}