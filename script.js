let isFinished = false;

let gameBoard = (() => {
  let cells;
  let startMenu;
  let gameContainer;
  let hasClickedOnCell = false;

  let setCells = () => {
    cells = document.querySelectorAll(".ttt-cells");
    return cells;
  }

  let getStartMenu = () => {
    startMenu = document.querySelector(".start-menu");
    return startMenu;
  }

  let getGameContainer = () => {
    gameContainer = document.querySelector(".ttt-page");
    return gameContainer;
  }

  let showStartMenu = (state) => {
    let restartBtn = document.querySelector(".game-state > button");
    getStartMenu();
    getGameContainer();

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        // controls the animations for the gameBoard and the startMenu
        if (state === "appear") {

          // remove older animations if any
          gameContainer.style.animation = "none";
          startMenu.style.animation = "none";

          gameContainer.style.animation = "disappear .5s";
          gameContainer.style.animationFillMode = "forwards";
          setTimeout(() => {
            gameContainer.style.display = "none";
            startMenu.style.display = "flex";
            startMenu.style.animation = "appear .5s";
            startMenu.style.animationFillMode = "forwards";
            resetGame();
            isFinished = false;
          }, 500);
        }
      })
    }

    const startBtn = document.querySelector(".start-menu > form > button");
    startBtn.addEventListener("mouseover", () => {
      let randomDeg = Math.round(((Math.random() - 0.5) * 10));
      startBtn.style.transform = `rotate(${randomDeg}deg)`;
    })
    startBtn.addEventListener("mouseout", () => {
      startBtn.style.transform = "rotate(0)";
    })
    startBtn.addEventListener("click", e => {
      e.preventDefault();
      const inputs = document.querySelectorAll(".name-inputs > input");
      let player1;
      let player2;
      if (!inputs[0].value) {
        player1 = players("player1", "cross");
      }
      if (!inputs[1].value) {
        player2 = players("player2", "circle");
      }
      if (inputs[0].value) {
        player1 = players(inputs[0].value, "cross");
      }
      if (inputs[1].value) {
        player2 = players(inputs[1].value, "circle");
      }

      // controls the animations on gameBoard and startMenu
      if (state === "disappear") {
        gameContainer.style.animation = "none";
        startMenu.style.animation = "none";

        startMenu.style.animation = "disappear .5s";
        startMenu.style.animationFillMode = "forwards";
        setTimeout(() => {
          startMenu.style.display = "none";
          gameContainer.style.display = "flex";
          gameContainer.style.animation = "appear .5s";
          gameContainer.style.animationFillMode = "forwards";
        }, 500);
      }

      gameBoard.playGameWith(player1, player2);
    })
  }

  let resetGame = () => {
    setCells();
    const gameState = document.querySelector(".game-state");
    cells.forEach(cell => {
      if (cell.innerHTML.includes("svg")) {
        cell.innerHTML = "";
      }
    })
    gameState.innerHTML = "";
  }

  let playRound = (cell) => {
    if (!hasClickedOnCell) {
      cell.addEventListener("click", function eventHandler() {
        displayController.addMark(cell);
        displayController.checkWinner(cell);
        hasClickedOnCell = true;
      });
    }
  }

  let displayState = (winner) => {
    const gameState = document.querySelector(".game-state");
    gameState.style.display = "block";

    const p = document.createElement("p");
    gameState.appendChild(p);

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "RESTART?";
    restartBtn.style.display = "none";
    gameState.appendChild(restartBtn);

    if (winner instanceof Object) {
      p.textContent = `The winner is ${winner[0].name}!`;
    } else if (winner === "tie") {
      p.textContent = "That's a tie!";
    }

    setTimeout(() => {
      p.style.animation = "disappear .5s";
      p.style.animationFillMode = "forwards";
      setTimeout(() => {
        p.style.display = "none";
        restartBtn.style.display = "block";
        restartBtn.style.animation = "appear .5s";
        restartBtn.style.animationFillMode = "forwards";
      }, 500)
    }, 3000)
    showStartMenu("appear");

  }

  let playGameWith = (...players) => {
    displayController.storePlayers(players);
    getGameContainer();
    getStartMenu();

    setCells();
    cells.forEach(cell => {
      playRound(cell);
    })
  }

  return {playGameWith, setCells, displayState, showStartMenu};

})();

let players = (name, mark) => {
  return {name, mark};
}

let displayController = (() => {
  let players = [];
  let currentlyPlaying;
  let areCellsFilled = true;

  let storePlayers = playersArr => {
    players.splice(0, players.length);
    playersArr.forEach(player => {
      players.push(player);
    })
  }

  let changeTurn = () => {
    currentlyPlaying = (currentlyPlaying === players[0]) ? players[1] : players[0];
  }

  let addMark = cell => {
    if (!isFinished) {
      if (!cell.innerHTML.includes("svg")) {
        changeTurn();
        if (currentlyPlaying.mark === "cross") {
          cell.innerHTML = "<svg class=\"cross-cell\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>";
        } else if (currentlyPlaying.mark === "circle") {
          cell.innerHTML = "<svg class=\"circle-cell\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z\" /></svg>";
        }
      }
    }
  }

  let getCellsWithCurrentMark = mark => {
    let cellsArr = [];
    let checkCells = gameBoard.setCells();

    checkCells.forEach((checkingCell, index) => {
      if (checkingCell.innerHTML.includes("svg")) {
        checkingCellMark = checkingCell.querySelector("svg").classList.value;
        if (mark === "cross-cell" && checkingCellMark === "cross-cell") {
          cellsArr.push(index + 1);
        } else if (mark === "circle-cell" && checkingCellMark === "circle-cell") {
          cellsArr.push(index + 1);
        }
      }
    })

    return cellsArr;
  }

  let findThreeInArow = (markCellIndex, markCellsArr, funcCall) => {
    let incrementor = 1;
    let checkCurrentCellsIndex = [];
    let hasWonObj = (count = 0, cellInArr = false) => {
      return {count, cellInArr}
    }
    let hasWon = hasWonObj();

    /* Checks 3 marks (cross or circle) in a row/diagonal/column
    with this pattern of searching:
    1) xxx ||

    2)  x ||
       x  ||
      x   ||

    3) x   ||
       x   ||
       x   ||

    4) x   ||
        x  ||
         x ||
    */

    for (let i = 0; i < 4; i++) {
      if (i === 1 && markCellIndex === 3) {
        incrementor = 2;
      } else if (i === 2) {
        incrementor = 3;
      } else if (i === 3) {
        incrementor = 4;
      } else if (incrementor === 1 && !(markCellIndex === 1 || markCellIndex === 4 || markCellIndex === 7)) {
        continue;
      }

      checkCurrentCellsIndex = [markCellIndex,
        markCellIndex + incrementor,
        markCellIndex + incrementor * 2]

      for (let n of checkCurrentCellsIndex) {
        for (let j of markCellsArr) {
          if (n === j) {
            hasWon.cellInArr = true;
            break;
          }
        }
        if (hasWon.cellInArr) {
          hasWon.count++;
          hasWon.cellInArr = false;
        }
      }

      // check if three marks are in a row/diag/column
      if (hasWon.count != 3) {
        hasWon.count = 0;
        hasWon.cellInArr = false;
      } else {
        break;
      }
    }

    if (hasWon.count === 3) {
      return true;
    } else {
      /* do recursive function by searching for three times
      for three same mark in a row/diag/column but starting with the
      secondMarkCell or thirdMarkCell starting from the top of the gameBoard */
      if (markCellsArr.length >= 3 && funcCall !== 3) {
        let secondMarkCell = document.querySelector(`.ttt-cells[data-index=\"${markCellsArr[funcCall]}\"]`);
        let markCellIndex = parseInt(secondMarkCell.getAttribute("data-index"));
        funcCall++
        return findThreeInArow(markCellIndex, markCellsArr, funcCall);
      }
    }
    return false;
  }

  let checkWinner = (pointedCell) => {
    hasClickedOnCell = false;
    if (!isFinished) {
      let cells = gameBoard.setCells();

      for (let cell of cells) {
        if (!cell.innerHTML.includes("svg")) {
          areCellsFilled = false;
          break;
        }
      }


      // gets the players current mark (cross or circle) from click
      const pointedCellMark = pointedCell.querySelector("svg").classList.value;

      let markCellsArr = getCellsWithCurrentMark(pointedCellMark);
      let firstMarkCell = document.querySelector(`.ttt-cells[data-index=\"${markCellsArr[0]}\"]`);
      let markCellIndex = parseInt(firstMarkCell.getAttribute("data-index"));

      let hasWon = findThreeInArow(markCellIndex, markCellsArr, 1);

      if (hasWon) {
        isFinished = true;
        winner = players.filter(player => pointedCellMark.includes(player.mark));

        // return the winning player
        return gameBoard.displayState(winner);
      }

      if (areCellsFilled) {
        return gameBoard.displayState("tie");
      }

      areCellsFilled = true;
    } else {
      hasWon = false;
      areCellsFilled = false;
    }
  }

  return {changeTurn, addMark, storePlayers, checkWinner, players, currentlyPlaying, isFinished, areCellsFilled};
})();

window.addEventListener("DOMContentLoaded", () => {
  gameBoard.showStartMenu("disappear");
})