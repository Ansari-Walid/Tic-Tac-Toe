const initialValue = {
  moves: [],
};
export default class Store {
  #state = initialValue;

  constructor(player) {
    this.player = player;
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
    const state = this.#getGameState();
    const stateClone = structuredClone(state);
    stateClone.moves.push({
      squareId,
      player: this.game.currentPlayer,
    });
    this.#saveGameState(stateClone);
  }

  reset() {
    this.#saveGameState(initialValue);
  }

  #getGameState() {
    return this.#state;
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
    this.#state = newState;
  }
}
