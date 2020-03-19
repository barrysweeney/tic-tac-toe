// gameboard module using revealing module pattern
const gameboard = (function() {
  "use strict";

  const board = Array.from(document.getElementsByClassName("tile"));

  function makeTilesSelectable() {
    for (let i = 0; i < board.length; i++) {
      board[i].addEventListener("click", function() {
        game.playerSelection(board[i]);
      });
    }
  }

  return { board, makeTilesSelectable };
})();

// game module using revealing module pattern
const game = (function() {
  "use strict";

  let turnDisplay = document.getElementById("turn");
  let gameDisplay = document.getElementById("gameDisplay");
  let playerForm = document.getElementById("playerForm");
  let playerTwoForm = document.getElementById("playerTwoForm");
  let singlePlayerModeButton = document.getElementById("singlePlay");
  let twoPlayerModeButton = document.getElementById("twoPlay");
  let startButton = document.getElementById("start");
  let resetButton = document.getElementById("reset");

  singlePlayerModeButton.addEventListener("click", setupSinglePlayerMode);
  twoPlayerModeButton.addEventListener("click", setupTwoPlayerMode);
  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", reset);

  let whoseTurn;
  let player1;
  let player2;
  let twoPlayerMode;
  let singlePlayerMode;

  function setupSinglePlayerMode() {
    gameDisplay.style.display = "block";
    playerTwoForm.style.display = "none"; // hide second player form
    singlePlayerMode = true;
    twoPlayerMode = false;
    twoPlayerModeButton.style.display = "none"; // hide two player mode button
  }

  function setupTwoPlayerMode() {
    gameDisplay.style.display = "block";
    playerTwoForm.style.display = "block"; // display second player form
    singlePlayerMode = false;
    twoPlayerMode = true;
    singlePlayerModeButton.style.display = "none"; // hide single player mode button
  }

  function startGame() {
    if (isFormComplete()) {
      createPlayers();
      whoseTurn = player1; // arbitrary default choice for who has first turn
      turnDisplay.innerHTML = `${whoseTurn.getName()}'s turn`;
      gameboard.makeTilesSelectable();
    }
  }

  function isFormComplete() {
    if (twoPlayerMode) {
      return (
        document.getElementById("inputPlayer1").value.length > 0 &&
        document.getElementById("inputPlayer2").value.length > 0
      );
    } else {
      return document.getElementById("inputPlayer1").value.length > 0;
    }
  }

  function createPlayers() {
    if (singlePlayerMode) {
      let { nameOfPlayer1 } = getFormValues();
      player1 = Player(nameOfPlayer1, "x");
      player2 = Player("Computer", "o");
    }
    if (twoPlayerMode) {
      let { nameOfPlayer1, nameOfPlayer2 } = getFormValues();
      player1 = Player(nameOfPlayer1, "x");
      player2 = Player(nameOfPlayer2, "o");
    }
  }

  function getFormValues() {
    if (singlePlayerMode) {
      let nameOfPlayer1 = document.getElementById("inputPlayer1").value;
      return { nameOfPlayer1 };
    }
    if (twoPlayerMode) {
      let nameOfPlayer1 = document.getElementById("inputPlayer1").value;
      let nameOfPlayer2 = document.getElementById("inputPlayer2").value;
      return { nameOfPlayer1, nameOfPlayer2 };
    }
  }

  let playerSelection = tile => {
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
        if (singlePlayerMode) {
          computerSelection();
        }
      }
    }
  };

  let computerSelection = () => {
    let index = generateRandomIndex();
    if (gameboard.board[index].innerHTML === "") {
      let p = document.createElement("p");
      p.innerHTML = getTurnMarker();
      gameboard.board[index].appendChild(p);
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

  const getTurnMarker = () => whoseTurn.getMarker();

  const nextTurn = () => {
    if (whoseTurn === player1) {
      whoseTurn = player2;
      if (twoPlayerMode) {
        turnDisplay.innerHTML = `${whoseTurn.getName()}'s turn`;
      }
    } else {
      whoseTurn = player1;
      turnDisplay.innerHTML = `${whoseTurn.getName()}'s turn`;
    }
  };

  let checkIfWon = () => {
    let firstTile;
    let secondTile;
    let thirdTile;
    for (let i = 0; i < winCombos.length; i++) {
      firstTile = winCombos[i][0];
      secondTile = winCombos[i][1];
      thirdTile = winCombos[i][2];

      // only check if all three board are marked
      if (
        gameboard.board[firstTile].innerHTML !== "" &&
        gameboard.board[secondTile].innerHTML !== "" &&
        gameboard.board[thirdTile].innerHTML !== ""
      ) {
        // check that the marker is the same on all three board
        if (
          gameboard.board[firstTile].innerHTML ===
            gameboard.board[secondTile].innerHTML &&
          gameboard.board[secondTile].innerHTML ===
            gameboard.board[thirdTile].innerHTML
        ) {
          return true;
        }
      }
    }
  };

  let showWinner = () => {
    turnDisplay.innerHTML = `${whoseTurn.getName()} wins`;
  };

  let checkIfTie = () => {
    let tie = true;
    for (let i = 0; i < gameboard.board.length; i++) {
      if (gameboard.board[i].innerHTML === "") {
        tie = false;
      }
    }
    return tie;
  };

  let showTie = () => {
    turnDisplay.innerHTML = "It's a tie";
  };

  let finishGame = () => {
    for (let i = 0; i < gameboard.board.length; i++) {
      if (gameboard.board[i].innerHTML === "") {
        gameboard.board[i].innerHTML = " ";
      }
    }
  };

  function reset() {
    // set board back to intial state
    for (let i = 0; i < gameboard.board.length; i++) {
      gameboard.board[i].innerHTML = "";
    }
    // set page back to initial state
    singlePlayerModeButton.style.display = "initial";
    twoPlayerModeButton.style.display = "initial";
    turnDisplay.innerHTML = "";
    gameDisplay.style.display = "none";
    playerForm.reset();
  }

  let generateRandomIndex = () => {
    return Math.floor(Math.random() * gameboard.board.length);
  };

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

  return { playerSelection };
})();

// player factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};
