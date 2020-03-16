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
    // only selects tile if not already selected
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", function() {
        game.selectTile(tiles[i]);
      });
    }
  })();

  return { tiles };
})();

// game module using revealing module pattern
const game = (function() {
  "use strict";

  let turnDisplay = document.getElementById("turn");
  let turn = player1;
  turnDisplay.innerHTML = `${turn.getName()}'s turn`;

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let reset = () => {
    for (let i = 0; i < gameboard.tiles.length; i++) {
      gameboard.tiles[i].innerHTML = "";
    }
  };

  let checkIfTie = () => {
    let tie = true;
    for (let i = 0; i < gameboard.tiles.length; i++) {
      if (gameboard.tiles[i].innerHTML === "") {
        tie = false;
      }
    }
    return tie;
  };

  let selectTile = tile => {
    if (tile.innerHTML === "") {
      tile.innerHTML = getTurnMarker();
      if (checkIfWon() === true) {
        showWinner();
        reset();
      } else if (checkIfTie() === true) {
        showTie();
        reset();
      } else {
        nextTurn();
      }
    }
  };

  let showTie = () => {
    turnDisplay.innerHTML = "It's a tie";
  };

  let showWinner = () => {
    turnDisplay.innerHTML = `${turn.getName()} wins`;
  };

  let checkIfWon = () => {
    let firstTile;
    let secondTile;
    let thirdTile;
    for (let i = 0; i < winCombos.length; i++) {
      firstTile = winCombos[i][0];
      secondTile = winCombos[i][1];
      thirdTile = winCombos[i][2];

      // only check if all three tiles are marked
      if (
        gameboard.tiles[firstTile].innerHTML !== "" &&
        gameboard.tiles[secondTile].innerHTML !== "" &&
        gameboard.tiles[thirdTile].innerHTML !== ""
      ) {
        // check that the mark is the same on all three tiles
        if (
          gameboard.tiles[firstTile].innerHTML ===
            gameboard.tiles[secondTile].innerHTML &&
          gameboard.tiles[secondTile].innerHTML ===
            gameboard.tiles[thirdTile].innerHTML
        ) {
          return true;
        }
      }
    }
  };

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

  return { selectTile };
})();
