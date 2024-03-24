import View from "./view.js";
import Store from "./store.js";

const player = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "turquoise",
  },
];

function init() {
  const store = new Store("live-storage-key", player);
  const view = new View();

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);

    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves);
  }

  window.addEventListener("storage", () => {
    initView();
  });

  initView();

  view.bindGameResetEvent((event) => {
    store.reset();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    view.handlePlayerMove(square, store.game.currentPlayer);
    store.playerMove(+square.id); //Advance to the next move

    if (store.game.status.isComplete) {
      view.openModel(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins`
          : "Tie"
      );
      return;
    }
    view.setTurnIndicator(store.game.currentPlayer);
  });
}
window.addEventListener("load", init);
