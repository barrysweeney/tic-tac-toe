// player factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};

const player1 = Player("Alice", "x");
const player2 = Player("Bob", "o");

// gameboard module using revealing module pattern
const gameboard = (function() {
  "use strict";

  const tilesCollection = document.getElementsByClassName("tile");
  const tiles = Array.from(tilesCollection);

  (function makeSelectable() {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", function(event) {
        if (tiles[i].innerHTML === "") {
          // checks if tile already selected
          game.getTurnMarker();
          tiles[i].innerHTML = game.getTurnMarker();
          game.nextTurn();
          // TODO: check if someone wins here
        }
      });
    }
  })();

  return {};
})();

// game module using revealing module pattern
const game = (function() {
  "use strict";

  let turnDisplay = document.getElementById("turn");
  let turn = player1;
  turnDisplay.innerHTML = `${turn.getName()}'s turn`;

  const getTurnMarker = () => turn.getMarker();

  const nextTurn = () => {
    if (turn === player1) {
      turn = player2;
      turnDisplay.innerHTML = `${turn.getName()}'s turn`;
    } else {
      turn = player1;
      turnDisplay.innerHTML = `${turn.getName()}'s turn`;
    }
  };

  return { nextTurn, getTurnMarker };
})();
