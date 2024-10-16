const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('start-button');

context.scale(30, 30);  // Increase the scale from 20 to 30

// Tetromino colors
const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

// Tetromino shapes
const pieces = 'TJLOSZI';

// Game state
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let score = 0;
let level = 1;
let paused = false;
let gameOver = false;

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

const arena = createMatrix(12, 20);

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        gameOver = true;
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    scoreElement.innerText = player.score;
    levelElement.innerText = level;
}

let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function update(time = 0) {
    if (gameOver || paused) {
        return;
    }

    const deltaTime = time - lastFrameTime;

    if (deltaTime >= frameInterval) {
        const deltaSeconds = deltaTime / 1000;
        dropCounter += deltaSeconds * 1000;
        if (dropCounter > dropInterval) {
            playerDrop();
        }

        draw();
        lastFrameTime = time - (deltaTime % frameInterval);
    }

    requestAnimationFrame(update);
}

function updateLevel() {
    level = Math.floor(player.score / 500) + 1;
    dropInterval = 1000 - (level - 1) * 50;
    if (dropInterval < 100) {
        dropInterval = 100;
    }
}

// Add these new button selectors
// const leftButton = document.getElementById('left-button');
// const rightButton = document.getElementById('right-button');
// const rotateButton = document.getElementById('rotate-button');
// const downButton = document.getElementById('down-button');

// Update the existing event listeners and add new ones
document.addEventListener('keydown', handleKeyPress);

// Update the key handling function
function handleKeyPress(event) {
    if (!gameOver && !paused) {
        switch (event.key) {
            case 'ArrowLeft':
                playerMove(-1);
                break;
            case 'ArrowRight':
                playerMove(1);
                break;
            case 'ArrowDown':
                playerDrop();
                break;
            case 'ArrowUp':
                playerRotate(1);
                break;
            case ' ':  // Spacebar
                playerDrop();
                break;
        }
    }
}

startButton.addEventListener('click', () => {
    if (gameOver) {
        gameOver = false;
        player.score = 0;
        level = 1;
        arena.forEach(row => row.fill(0));
        updateScore();
        playerReset();
        paused = false;
        update();
        startButton.textContent = 'Pause';
    } else {
        paused = !paused;
        if (!paused) {
            update();
            startButton.textContent = 'Pause';
        } else {
            startButton.textContent = 'Resume';
        }
    }
});

// Add a function to handle window focus
window.addEventListener('focus', () => {
    if (paused) {
        paused = false;
        update();
        startButton.textContent = 'Pause';
    }
});

// Add a function to handle window blur
window.addEventListener('blur', () => {
    if (!paused && !gameOver) {
        paused = true;
        startButton.textContent = 'Resume';
    }
});

// Initialize the game
playerReset();
updateScore();
update();
