import type { Move, Player } from "./types";
import type Store from "./store";
import { DerivedGame, derivedStats } from "./store";

export default class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};
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
    this.$.grid = this.#qs('[data-id="grid"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI Only Event Listeners
    this.$.actionsButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }
  render(game: DerivedGame, stats: derivedStats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModel(winner ? `${winner.name} wins` : "Tie");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  //  *Register All Event Listeners
  #updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
    this.$.p1Wins.textContent = `${p1Wins} wins`;
    this.$.p2Wins.textContent = `${p2Wins} wins`;
    this.$.ties.textContent = `${ties} ties `;
  }

  bindGameResetEvent(handler: EventListener) {
    this.$.reset.addEventListener("click", handler);
    this.$.modalButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newGame.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: (el: Element) => void) {
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
  }

  // Dom Helper Methods
  #openModel(msg: string) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.textContent = msg;
  }
  #closeModel() {
    this.$.modal.classList.add("hidden");
  }
  #closeAll() {
    this.#closeModel();
    this.#closeMenu();
  }
  #clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }
  #closeMenu() {
    this.$.items.classList.add("hidden");
    this.$.actionsButton.classList.remove("border");

    const icon = this.#qs("i", this.$.actionsButton);
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }
  #toggleMenu() {
    this.$.items.classList.toggle("hidden");
    this.$.actionsButton.classList.toggle("border");

    const icon = this.#qs("i", this.$.actionsButton);
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #setTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);

    label.classList.add(player.colorClass);
    label.textContent = `${player.name} you're turn`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent?: Element) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("Could Not Find elemnt");
    return el;
  }
  #qsAll(selector: string) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error("Could Not Find the elemnts");
    return el;
  }
  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      if (!(event.target instanceof Element)) {
        throw new Error("Event Target Not Found");
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
