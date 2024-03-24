export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.actions = this.#qs('[data-id="actions"]');
    this.$.actionsButton = this.#qs('[data-id="action-button"]');
    this.$.items = this.#qs('[data-id ="items"]');
    this.$.reset = this.#qs('[data-id ="reset"]');
    this.$.newGame = this.#qs('[data-id ="newgame"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalButton = this.#qs('[data-id="modal-button"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI Only Event Listeners

    this.$.actionsButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  /**
   *Register All Event Listeners
   */
  updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} wins`;
    this.$.p2Wins.innerText = `${p2Wins} wins`;
    this.$.ties.innerText = `${ties} ties `;
  }

  bindGameResetEvent(handler) {
    this.$.reset.addEventListener("click", handler);
    this.$.modalButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newGame.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  // Dom Helper Methods
  openModel(msg) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = msg;
  }
  #closeModel() {
    this.$.modal.classList.add("hidden");
  }
  closeAll() {
    this.#closeModel();
    this.#closeMenu();
  }
  clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }
  #closeMenu() {
    this.$.items.classList.add("hidden");
    this.$.actionsButton.classList.remove("border");

    const icon = this.$.actionsButton.querySelector("i");
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }
  #toggleMenu() {
    this.$.items.classList.toggle("hidden");
    this.$.actionsButton.classList.toggle("border");

    const icon = this.$.actionsButton.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }
  initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.handlePlayerMove(square, existingMove.player);
      }
    });
  }

  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);

    label.classList.add(player.colorClass);
    label.innerText = `${player.name} you're turn`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent) {
    const el = parent ? parent.querySelector : document.querySelector(selector);
    if (!el) throw new Error("Could Not Find elemnt");
    return el;
  }
  #qsAll(selector) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error("Could Not Find the elemnts");
    return el;
  }
}
