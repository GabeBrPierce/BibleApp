// base.js (included on every page)
window.KeyRouter = {
  handlers: {},

  setHandlers(map) {
    this.handlers = map;
  },

  clearHandlers() {
    this.handlers = {};
  },
};

window.Softkeys = {
  set(left, center, right) {
    document.getElementById("left").textContent = left || "";
    document.getElementById("center").textContent = center || "";
    document.getElementById("right").textContent = right || "";
  },

  actions: {
    left: null,
    center: null,
    right: null,
  },

  on(key, fn) {
    this.actions[key] = fn;
  },

  clear() {
    this.set("", "", "");
    this.actions = {
      left: null,
      center: null,
      right: null,
    };
  },
};

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "SoftLeft":
      Softkeys.actions.left?.();
      break;
    case "Enter":
      Softkeys.actions.center?.();
      break;
    case "SoftRight":
      Softkeys.actions.right?.();
      break;
  }
  const handler = KeyRouter.handlers[e.key];
  if (handler) handler(e);
});

window.Menu = {
  items: [],
  index: 0,
  onSelect: null,

  init(selector, onSelect) {
    this.items = Array.from(document.querySelectorAll(selector + " > div"));
    this.index = 0;
    this.onSelect = onSelect;
    this.render();
  },

  render() {
    this.items.forEach((el, i) => {
      el.classList.toggle("selected", i === this.index);
    });
  },

  move(delta) {
    this.index += delta;

    // clamp — no wrap unless you want it
    if (this.index < 0) this.index = 0;
    if (this.index >= this.items.length) this.index = this.items.length - 1;

    this.render();
  },

  select() {
    const el = this.items[this.index];
    if (!el) return;
    const id = el.dataset.jsMenuId;
    this.onSelect?.(id, el);
  },
};

function goTo(path) {
  window.location.href = path;
}
