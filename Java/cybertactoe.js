const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let humanPlayer = "";
let cpuPlayer = "";
let currentPlayerTurn = "X"; // X always starts in Tic Tac Toe rules

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// Function called when player clicks "Play as X" or "Play as O"
function startGame(selection) {
  humanPlayer = selection;
  cpuPlayer = selection === "X" ? "O" : "X";
  currentPlayerTurn = "X";
  gameActive = true;

  // UI updates
  startScreen.style.display = "none";
  gameContainer.style.display = "flex";

  updateStatus();

  // If human picked 'O', CPU (who is 'X') must move first
  if (cpuPlayer === "X") {
    setTimeout(cpuMove, 800);
  }
}

function updateStatus() {
  if (!gameActive) return;
  if (currentPlayerTurn === humanPlayer) {
    statusDisplay.innerText = `YOUR TURN (${humanPlayer})`;
    statusDisplay.style.color =
      humanPlayer === "X" ? "var(--neon-pink)" : "var(--neon-blue)";
  } else {
    statusDisplay.innerText = `CPU (${cpuPlayer}) IS THINKING...`;
    statusDisplay.style.color =
      cpuPlayer === "X" ? "var(--neon-pink)" : "var(--neon-blue)";
  }
}

function handleCellClick(e) {
  // Prevent clicking if game paused, cell full, or it's CPU's turn
  if (!gameActive || currentPlayerTurn !== humanPlayer) return;

  const clickedCell = e.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "") return;

  handleMove(clickedCell, clickedCellIndex, humanPlayer);
}

function handleMove(cell, index, player) {
  gameState[index] = player;
  cell.innerText = player;
  cell.classList.add(player);

  if (checkResult()) {
    // Game ended in checkResult
  } else {
    // Switch turns
    currentPlayerTurn = currentPlayerTurn === "X" ? "O" : "X";
    updateStatus();

    // If it's now CPU's turn, trigger it
    if (gameActive && currentPlayerTurn === cpuPlayer) {
      setTimeout(cpuMove, 800); // 0.8s delay for "thinking" feel
    }
  }
}

function findBestMove() {
  // 1. Check if CPU can win
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] === cpuPlayer &&
      gameState[b] === cpuPlayer &&
      gameState[c] === ""
    )
      return c;
    if (
      gameState[a] === cpuPlayer &&
      gameState[c] === cpuPlayer &&
      gameState[b] === ""
    )
      return b;
    if (
      gameState[b] === cpuPlayer &&
      gameState[c] === cpuPlayer &&
      gameState[a] === ""
    )
      return a;
  }

  // 2. Check if human is about to win and block them
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] === humanPlayer &&
      gameState[b] === humanPlayer &&
      gameState[c] === ""
    )
      return c;
    if (
      gameState[a] === humanPlayer &&
      gameState[c] === humanPlayer &&
      gameState[b] === ""
    )
      return b;
    if (
      gameState[b] === humanPlayer &&
      gameState[c] === humanPlayer &&
      gameState[a] === ""
    )
      return a;
  }

  // 3. Take the center if available
  if (gameState[4] === "") return 4;

  // 4. Take a random available corner
  const corners = [0, 2, 6, 8].filter((index) => gameState[index] === "");
  if (corners.length > 0)
    return corners[Math.floor(Math.random() * corners.length)];

  // 5. Take any available spot
  const available = gameState
    .map((val, idx) => (val === "" ? idx : null))
    .filter((val) => val !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function cpuMove() {
  if (!gameActive) return;

  const bestMoveIndex = findBestMove();

  const cell = document.querySelector(`.cell[data-index='${bestMoveIndex}']`);
  handleMove(cell, bestMoveIndex, cpuPlayer);
}

function checkResult() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "")
      continue;
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerText =
      currentPlayerTurn === humanPlayer
        ? "SYSTEM BREACH: YOU WIN!"
        : "SYSTEM FAILURE: CPU WINS!";
    statusDisplay.style.color =
      currentPlayerTurn === humanPlayer ? "var(--neon-green)" : "red";
    gameActive = false;
    return true; // Game ended
  }

  if (!gameState.includes("")) {
    statusDisplay.innerText = "STALEMATE DETECTED";
    statusDisplay.style.color = "white";
    gameActive = false;
    return true; // Game ended
  }

  return false; // Game continues
}

// Resets the board but keeps the current X/O selection
function resetBoard() {
  gameActive = true;
  currentPlayerTurn = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("X", "O");
  });
  updateStatus();
  if (cpuPlayer === "X") {
    setTimeout(cpuMove, 800);
  }
}

// Resets everything back to the selection screen
function fullReset() {
  gameActive = false;
  gameState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("X", "O");
  });
  statusDisplay.innerText = "Awaiting Input...";
  statusDisplay.style.color = "var(--neon-blue)";
  gameContainer.style.display = "none";
  startScreen.style.display = "block";
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
