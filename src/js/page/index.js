window.addEventListener("load", () => {
  Menu.init(".js-menu", (id) => console.log("Selected", id));

  Softkeys.set("", "Select", "");

  KeyRouter.setHandlers({
    ArrowUp: () => Menu.move(-1),
    ArrowDown: () => Menu.move(1),
    Enter: () => Menu.select(),
  });
});
