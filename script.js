// player factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};

// gameboard module using revealing module pattern
const gameboard = (function() {
  "use strict";

  const tilesCollection = document.getElementsByClassName("tile");
  const tiles = Array.from(tilesCollection);

  function makeSelectable() {
    // only selects tile if not already selected
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", function() {
        game.selectTile(tiles[i]);
      });
    }
  }

  return { tiles, makeSelectable };
})();

// game module using revealing module pattern
const game = (function() {
  "use strict";

  let turnDisplay = document.getElementById("turn");
  let turn;
  let player1;
  let player2;
  let playerForm = document.getElementById("playerForm");

  // checks if values enterred in all form fields
  function formComplete() {
    return document.getElementById("inputPlayer1").value.length > 0;
  }

  function getFormValues() {
    let name1 = document.getElementById("inputPlayer1").value;
    return { name1 };
  }

  function startGame() {
    if (formComplete()) {
      let { name1 } = getFormValues();
      player1 = Player(name1, "x");
      player2 = Player("Computer", "o");
      turn = player1;
      turnDisplay.innerHTML = `${turn.getName()}'s turn`;
      gameboard.makeSelectable();
    }
  }

  let startButton = document.getElementById("start");
  let resetButton = document.getElementById("reset");

  startButton.addEventListener("click", startGame);

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
    playerForm.reset();
    turnDisplay.innerHTML = "";
  };

  let finishGame = () => {
    for (let i = 0; i < gameboard.tiles.length; i++) {
      if (gameboard.tiles[i].innerHTML === "") {
        gameboard.tiles[i].innerHTML = " ";
      }
    }
  };

  resetButton.addEventListener("click", reset);

  let checkIfTie = () => {
    let tie = true;
    for (let i = 0; i < gameboard.tiles.length; i++) {
      if (gameboard.tiles[i].innerHTML === "") {
        tie = false;
      }
    }
    return tie;
  };

  let generateRandomIndex = () => {
    return Math.round(Math.random() * gameboard.tiles.length);
  };

  let computerSelection = () => {
    let index = generateRandomIndex();
    if (gameboard.tiles[index].innerHTML === "") {
      let p = document.createElement("p");
      p.innerHTML = getTurnMarker();
      gameboard.tiles[index].appendChild(p);
      if (checkIfWon() === true) {
        showWinner();
        finishGame();
      } else if (checkIfTie() === true) {
        showTie();
        finishGame();
      } else {
        nextTurn();
      }
    } else {
      computerSelection();
    }
  };

  let selectTile = tile => {
    if (tile.innerHTML === "") {
      let p = document.createElement("p");
      p.innerHTML = getTurnMarker();
      tile.appendChild(p);
      if (checkIfWon() === true) {
        showWinner();
        finishGame();
      } else if (checkIfTie() === true) {
        showTie();
        finishGame();
      } else {
        nextTurn();
        computerSelection();
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
