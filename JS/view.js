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

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI Only Event Listeners

    this.$.actionsButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  /**
   *Register All Event Listeners
   */

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
  closeModel() {
    this.$.modal.classList.add("hidden");
  }
  clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
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
