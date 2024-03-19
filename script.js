let moves = [];
const actions = document.querySelector('[data-id="actions"]');
const items = document.querySelector('[data-id ="items"]');
const reset = document.querySelector('[data-id ="reset"]');
const newGame = document.querySelector('[data-id ="newgame"]');
const squares = document.querySelectorAll('[data-id="square"]');
const modal = document.querySelector('[data-id="modal"]');
const modalText = document.querySelector('[data-id="modal-text"]');
const modalButton = document.querySelector('[data-id="modal-button"]');

// Utility Function
const getGameStatus = (moves) => {
  const p1Moves = moves
    .filter((move) => move.playerId === 0)
    .map((move) => +move.squareId);
  const p2Moves = moves
    .filter((move) => move.playerId === 1)
    .map((move) => +move.squareId);

  const winningPattern = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [3, 6, 9],
    [2, 5, 8],
    [3, 5, 7],
    [4, 5, 6],
    [7, 8, 9],
  ];
  let winner = null;
  winningPattern.forEach((pattern) => {
    const p1Wins = pattern.every((v) => p1Moves.includes(v));
    const p2Wins = pattern.every((v) => p2Moves.includes(v));

    if (p1Wins) winner = 1;
    if (p2Wins) winner = 2;
  });

  return {
    status: moves.length === 9 || winner != null ? "completed" : "in-progress",
    // in-progress | completed
    winner, // 1 | 2 | null
  };
};

// Toggle the Menu
actions.addEventListener("click", () => {
  items.classList.toggle("hidden");
});
reset.addEventListener("click", () => {
  console.log("Game Reset");
});
newGame.addEventListener("click", () => {
  console.log("New Game");
});

modalButton.addEventListener("click", (event) => {
  moves = [];
  squares.forEach((square) => square.replaceChildren());
  modal.classList.add("hidden");
});

// Change Player Turn and Display Icons
squares.forEach((square) => {
  square.addEventListener("click", (event) => {
    const hasMove = (squareId) => {
      const existingMove = moves.find((move) => move.squareId === squareId);
      return existingMove !== undefined;
    };
    if (hasMove(square.id)) {
      return;
    }
    const lastMove = moves.at(-1);
    const oppositePlayer = (playerid) => (playerid === 0 ? 1 : 0);
    let currentPlayer =
      moves.length === 0 ? 0 : oppositePlayer(lastMove.playerId);
    const icon = document.createElement("i");

    if (currentPlayer === 0) {
      icon.classList.add("fa-solid", "fa-x", "yellow");
    } else {
      icon.classList.add("fa-solid", "fa-o", "turquoise");
    }

    moves.push({
      squareId: square.id,
      playerId: currentPlayer,
    });

    square.replaceChildren(icon);

    // check if the game is won or tie
    const game = getGameStatus(moves);
    if (game.status === "completed") {
      modal.classList.remove("hidden");
      let message = "";
      if (game.winner) {
        message = `Player ${game.winner} wins`;
      } else {
        message = "Game Tied";
      }
      modalText.textContent = message;
    }
  });
});
