let gameBoard = (() => {
  let cells;

  let setCells = () => {
    cells = document.querySelectorAll(".ttt-cells");
    return cells;
  }

  let playRound = (cell) => {
    cell.addEventListener("click", () => {
      displayController.addMark(cell);
      winner = displayController.checkWinner(cell);
      if (winner instanceof Object) {
        displayWinner(winner);
      }
    });
  }

  let displayWinner = (winner) => {
    const gameState = document.querySelector(".game-state");
    console.log(winner[0]);
    gameState.innerHTML = `The winner is ${winner[0].name}!`;
    gameState.style.display = "block";
  }

  let playGameWith = (...players) => {
    displayController.storePlayers(players);

    setCells();
    cells.forEach(cell => {
      playRound(cell);
    })
  }

  return {playGameWith, cells, setCells};

})();

let players = (name, mark) => {
  return {name, mark};
}

let displayController = (() => {
  let players = [];
  let currentlyPlaying;
  let isFinished = false;

  let storePlayers = playersArr => {
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
      /* do recursive function by searching for a second time
      for three same mark in a row/diag/column but starting with the
      secondMarkCell starting from the top of the gameBoard */
      if (markCellsArr.length >= 2 && funcCall !== 2) {
        let secondMarkCell = document.querySelector(`.ttt-cells[data-index=\"${markCellsArr[1]}\"]`);
        let markCellIndex = parseInt(secondMarkCell.getAttribute("data-index"));
        return findThreeInArow(markCellIndex, markCellsArr, 2);
      }
    }
    return false;
  }

  let checkWinner = (pointedCell) => {
    if (!isFinished) {
      // gets the players current mark (cross or circle) from click
      const pointedCellMark = pointedCell.querySelector("svg").classList.value;

      let markCellsArr = getCellsWithCurrentMark(pointedCellMark);
      let firstMarkCell = document.querySelector(`.ttt-cells[data-index=\"${markCellsArr[0]}\"]`);
      let markCellIndex = parseInt(firstMarkCell.getAttribute("data-index"));

      let hasWon = findThreeInArow(markCellIndex, markCellsArr, 1);

      if (hasWon) {
        isFinished = true;

        // return the winning player
        return players.filter(player => pointedCellMark.includes(player.mark));
    }
    }
  }

  return {changeTurn, addMark, players, storePlayers, checkWinner};
})();

window.addEventListener("DOMContentLoaded", () => {
  const john = players("john", "cross");
  const martin = players("martin", "circle");
  gameBoard.playGameWith(john, martin);
})