window.addEventListener("load", () => {
  // Initialize the menu on this page
  Menu.init(".js-menu", onMenuSelect);

  // Softkeys for this page
  Softkeys.set("", "Select", "");

  // Key navigation for this page
  KeyRouter.setHandlers({
    ArrowUp: () => Menu.move(-1),
    ArrowDown: () => Menu.move(1),
    Enter: () => Menu.select()
  });
});

// -------------------------------------------
// Page-specific actions
// -------------------------------------------
function onMenuSelect(id) {
  switch (id) {
    case "continueReading":
      goTo("/page/read.html");
      break;

    case "continueFromBookmark":
      goTo("/page/bookmarks.html");
      break;

    case "searchAddress":
      goTo("/page/search-address.html");
      break;

    case "searchKeyword":
      goTo("/page/search-keyword.html");
      break;

    case "manageBookmarks":
      goTo("/page/manage-bookmarks.html");
      break;

    case "manageHighlights":
      goTo("/page/manage-highlights.html");
      break;

    case "manageNotes":
      goTo("/page/manage-notes.html");
      break;
  }
}

