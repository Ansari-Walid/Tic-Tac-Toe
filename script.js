let currentPlayer = 0;

const actions = document.querySelector('[data-id="actions"]');
const items = document.querySelector('[data-id ="items"]');
const reset = document.querySelector('[data-id ="reset"]');
const newGame = document.querySelector('[data-id ="newgame"]');
const squares = document.querySelectorAll('[data-id="square"]');

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

// Change Player Turn and Display Icons
squares.forEach((square) => {
  square.addEventListener("click", (event) => {
    if (square.hasChildNodes()) {
      return;
    }
    const icon = document.createElement("i");

    if (currentPlayer === 0) {
      icon.classList.add("fa-solid", "fa-x", "yellow");
    } else {
      icon.classList.add("fa-solid", "fa-o", "turquoise");
    }
    currentPlayer = currentPlayer ? 0 : 1;
    square.replaceChildren(icon);

    // check if the game is won or tie
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
  });
});
