const initialValue = {
  moves: [],
  history: {
    currentRoundGame: [],
    allGames: [],
  },
};
export default class Store {
  constructor(key, player) {
    this.storageKey = key;
    this.player = player;
  }

  get stats() {
    const state = this.#getGameState();
    return {
      playerWithStats: this.player.map((p) => {
        const wins = state.history.currentRoundGame.filter(
          (game) => game.status.winner?.id === p.id
        ).length;
        return {
          ...p,
          wins,
        };
      }),
      ties: state.history.currentRoundGame.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }

  get game() {
    const state = this.#getGameState();
    const currentPlayer = this.player[state.moves.length % 2];

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

    for (const player of this.player) {
      const selectedSquareId = state.moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of winningPattern) {
        if (pattern.every((v) => selectedSquareId.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      currentPlayer,
      moves: state.moves,
      status: {
        isComplete: winner !== null || state.moves.length === 9,
        winner,
      },
    };
  }

  playerMove(squareId) {
    const stateClone = structuredClone(this.#getGameState());
    stateClone.moves.push({
      squareId,
      player: this.game.currentPlayer,
    });
    this.#saveGameState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getGameState());
    const { status, moves } = this.game;
    if (status.isComplete) {
      stateClone.history.currentRoundGame.push({
        moves,
        status,
      });
    }
    stateClone.moves = [];
    this.#saveGameState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getGameState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGame);
    stateClone.history.currentRoundGame = [];

    this.#saveGameState(stateClone);
  }

  #saveGameState(stateOrFn) {
    const prevState = this.#getGameState();
    let newState;
    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid Argument");
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
  }
  #getGameState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }
}
