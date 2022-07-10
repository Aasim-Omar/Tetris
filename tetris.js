let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.scale(20, 20);

function collide(arena, player) {
  const [m, p] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (
        m[y][x] != 0 &&
        (arena[y + p.y] && arena[y + p.y][x + p.x]) != false
      ) {
        return true;
      }
    }
  }
  return false;
}

function playerReset() {
  player.matrix = createPiece();
  player.pos.y = 0;
  player.pos.x = 5;
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    scores = 0;
  }
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

const colors = [
  null,
  "#a4b0be",
  "#ff6b81",
  "#1abc9c",
  "#34495e",
  "#9b59b6",
  "#e74c3c",
  "#f1c40f",
];

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

const arena = createMatrix(12, 20);

let scores = 0;
let scoresContainer = document.querySelector(".lines .count");

function arenaSwipe() {
  arena.forEach((ele, i) => {
    if (ele.every((el) => el > 0)) {
      arena.splice(i, 1);
      arena.unshift(new Array(ele.length).fill(0));
      scores++;
    }
  });
}

const player = {
  pos: { x: 5, y: -1 },
  matrix: createPiece(),
};

function merg(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
function update(time = 0) {
  deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

function updateScores() {
  scoresContainer.innerHTML = scores;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merg(arena, player);
    playerReset();
    arenaSwipe();
    updateScores();
  }
  dropCounter = 0;
}

function createPiece() {
  pieces = "ILJOTSZ";
  let rand = Math.floor(Math.random() * pieces.length);
  let type = pieces[rand];
  if (type == "T") {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
  if (type == "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  }
  if (type == "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  }
  if (type == "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  }
  if (type == "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  }
  if (type == "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  }
  if (type == "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotateMatrix(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotateMatrix(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotateMatrix(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) playerMove(-1);
  if (e.keyCode == 39) playerMove(1);
  if (e.keyCode == 40) playerDrop();
  if (e.keyCode == 87) playerRotate(-1);
  if (e.keyCode == 81 || e.keyCode == 38) playerRotate(1);
});

update();
