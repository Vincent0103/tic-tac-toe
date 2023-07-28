let isFinished = false;
let currentlyPlaying;
let userCanClick = true;

let gameBoard = (() => {
  let cells;
  let startMenu;
  let gameContainer;
  let hasClickedOnCell = false;
  let hasClickedOnBotBtn = false;

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

  let handleBotBtn = (botBtn) => {

    // prevents events occuring more than once
    if (!hasClickedOnBotBtn) {
      botBtn.addEventListener("click", () => {
        if (!botBtn.classList.contains("bot-btn-active")) {
          botBtn.classList.add("bot-btn-active");
        } else {
          botBtn.classList.remove("bot-btn-active");
          console.log(botBtn);
        }
        botBtn.classList.remove("bot-btn-hover");
      })

      botBtn.addEventListener("mouseenter", () => {
        botBtn.classList.add("bot-btn-hover");
      })

      botBtn.addEventListener("mouseleave", () => {
        botBtn.classList.remove("bot-btn-hover");
      })
    }
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
    const botBtn = document.querySelector(".name-inputs > .bot-btn");

    handleBotBtn(botBtn);

    startBtn.addEventListener("mouseover", () => {

      // gets a random rotation degree between -5 and 5
      let randomDeg = Math.round(((Math.random() - 0.5) * 10));
      startBtn.style.transform = `rotate(${randomDeg}deg)`;
    })
    startBtn.addEventListener("mouseout", () => {
      startBtn.style.transform = "rotate(0)";
    })
    startBtn.addEventListener("click", e => {
      e.preventDefault();
      hasClickedOnBotBtn = true;
      const inputs = document.querySelectorAll(".name-inputs > input");
      let player1;
      let player2;
      userCanClick = true;

      // check if the inputs got values in them
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

      if (botBtn.classList.contains("bot-btn-active")) {
        player2.isAi = true;
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

      currentlyPlaying = player1;
      playGameWith(player1, player2);
    })
  }

  let resetGame = () => {
    setCells();
    hasClickedOnBotBtn = false;
    const gameState = document.querySelector(".game-state");
    cells.forEach(cell => {
      if (cell.innerHTML.includes("svg")) {
        cell.innerHTML = "";
      }
    })
    gameState.innerHTML = "";
  }

  let playRound = (cell) => {

    // prevents from multiple clicks occuring when restarting the game
    if (!hasClickedOnCell) {

      cell.addEventListener("click", () => {
        if (userCanClick) {
          console.log(userCanClick);
          displayController.addMark(cell);
          displayController.checkWinner(cell);
          hasClickedOnCell = true;
        }
      });

      cell.addEventListener("mouseenter", () => {
        if (userCanClick) displayController.hoverMark(cell, "mouseenter");
      })

      cell.addEventListener("mouseleave", () => {
        if (userCanClick) displayController.hoverMark(cell, "mouseleave");
      })
    }
  }

  let displayPlayersTurn = () => {
    const gameState = document.querySelector(".game-state");

    if (!isFinished) {
      gameState.textContent = `${currentlyPlaying.name}'s turn`;
    }
  }

  let displayWinState = (winner) => {
    const gameState = document.querySelector(".game-state");
    gameState.textContent = "";

    const p = document.createElement("p");
    gameState.appendChild(p);

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "RESTART?";
    restartBtn.style.display = "none";
    gameState.appendChild(restartBtn);

    if (winner instanceof Object) {

      // winner[0] because the returned winner is player object
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
    }, 2000)
    showStartMenu("appear");

  }

  let playGameWith = (...players) => {
    displayController.storePlayers(players);
    setCells();
    displayPlayersTurn();
    cells.forEach(cell => {
      playRound(cell);
    })
  }

  return {setCells, displayWinState, displayPlayersTurn, showStartMenu};

})();

let players = (name, mark, isAi=false) => {
  return {name, mark, isAi};
}

let displayController = (() => {
  let players = [];
  let areCellsFilled = true;

  let storePlayers = playersArr => {

    // remove stored players from the old game (if any) and the new ones when restarting
    players.splice(0, players.length);
    playersArr.forEach(player => {
      players.push(player);
    })
  }

  let changeTurn = () => {
    currentlyPlaying = (currentlyPlaying === players[0]) ? players[1] : players[0];

    if (currentlyPlaying.isAi) {
      aiController.addMark();
    }
    gameBoard.displayPlayersTurn();
  }

  let addMark = cell => {
    let cellSvg = cell.querySelector("svg");

    // checks if the mark from the hovering cell is not added yet; if true, add it
    if (!isFinished && cellSvg.style.opacity === "0.5") {
      cellSvg.style.opacity = 1;
      changeTurn();
    }
  }

  /* display the player's mark on hover but with a low opacity
  to indicate that it's a possible move */
  let hoverMark = (cell, e) => {
    let cellSvg;

    if (!currentlyPlaying) {
      currentlyPlaying = players[0];
    }

    if (!isFinished) {
      if (e === "mouseenter") {
        if (!cell.querySelector("svg")) {
          if (currentlyPlaying.mark === "cross") {
            cell.innerHTML = "<svg class=\"cross-cell\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>";
          } else if (currentlyPlaying.mark === "circle") {
            cell.innerHTML = "<svg class=\"circle-cell\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z\" /></svg>";
          }
          cellSvg = cell.querySelector("svg");
          cellSvg.style.opacity = .5;

          /* actually verifies if the mouse is hovering on an added mark.
          If so, we avoid any conflicts by adding this condition and move on */
        } else if (cell.querySelector("svg").style.opacity === "1") {
          ;
        }

      } else if (e === "mouseleave") {
        cellSvg = cell.querySelector("svg");
        if (cellSvg && cellSvg.style.opacity === "0.5") {
          cell.removeChild(cellSvg);
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
    with this pattern of searching and associating each cell
    with a data-index attribute to easily locate them:

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

      /* checks if three marks are in a row/diag/column,
      if not we do the next pattern of searching */
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

      /* do recursive function by searching three times,
      for three same mark in a row/diag/column but starting with the
      first three cells with the same mark at a time
      starting from the top of the gameBoard */
      if (markCellsArr.length >= 3 && funcCall !== 3) {
        let currentMarkCell = document.querySelector(`.ttt-cells[data-index=\"${markCellsArr[funcCall]}\"]`);
        let markCellIndex = parseInt(currentMarkCell.getAttribute("data-index"));
        funcCall++;
        return findThreeInArow(markCellIndex, markCellsArr, funcCall);
      }
    }

    /* returns false if has currently didn't find
    the same mark three in a row/diag/column */
    return false;
  }

  let checkWinner = (pointedCell) => {
    /* player able to click on cells when currently checking if there are
    any winners */
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
        return gameBoard.displayWinState(winner);
      }

      if (areCellsFilled) {
        isFinished = true;
        return gameBoard.displayWinState("tie");
      }

      areCellsFilled = true;
    } else {
      hasWon = false;
      areCellsFilled = false;
    }
  }

  return {changeTurn, addMark, hoverMark, storePlayers, checkWinner};
})();

let aiController = (() => {
  let chooseOptimumCell = () => {
    let avaiableCells = [];
    const cells = gameBoard.setCells();
    cells.forEach(cell => {
      if (!cell.innerHTML.includes("svg")) {
        avaiableCells.push(cell.getAttribute("data-index"));
      }
    })

    return avaiableCells;
  }

  let addMark = () => {
    const avaiableCells = chooseOptimumCell();
    if (avaiableCells.length > 0) {
      const choosenCellIndex = avaiableCells[Math.floor(Math.random() * avaiableCells.length)];
      let choosenCell;
      const cells = gameBoard.setCells();
      cells.forEach(cell => {
        if (parseInt(cell.getAttribute("data-index")) === parseInt(choosenCellIndex)) {
          console.log("doing");
          choosenCell = cell;
        }
      })

      userCanClick = false;
      setTimeout(() => {
        if (!isFinished) {
          choosenCell.innerHTML = "<svg class=\"circle-cell\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z\" /></svg>";
          displayController.checkWinner(choosenCell);
          displayController.changeTurn();
          userCanClick = true;
        }
      }, 200);
    }
  }

  return {addMark}
})()

window.addEventListener("DOMContentLoaded", () => {
  gameBoard.showStartMenu("disappear");
})