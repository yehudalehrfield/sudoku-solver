class SudokuSolver {
  validate(puzzleString) {
    // check if any characters are not valid
    const invalidSudokuVal = /[^1-9|\.]/g;
    if (invalidSudokuVal.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    // check length of puzzle string
    if (puzzleString.length != 81)
      return { error: "Expected puzzle to be 81 characters long" };
    return !invalidSudokuVal.test(puzzleString);
  }

  // FUTURE: Combine the six check function into three (?)
  // Check valid row entry form puzzle matrix (0-based index)
  checkRow(puzzleMatrix, row, val) {
    for (let i = 0; i < 9; i++) {
      if (puzzleMatrix[row][i] == val) return false;
    }
    return true;
  }
  // Check valid column entry form puzzle matrix (0-based index)
  checkCol(puzzleMatrix, col, val) {
    for (let i = 0; i < 9; i++) {
      if (puzzleMatrix[i][col] == val) return false;
    }
    return true;
  }
  // Check valid region entry form puzzle matrix (0-based index)
  checkRegion(puzzleMatrix, row, col, val) {
    let rowIdx = Math.floor(row / 3) * 3;
    let colIdx = Math.floor(col / 3) * 3;
    let regionVals = [];
    for (let i = rowIdx; i < rowIdx + 3; i++) {
      for (let j = colIdx; j < colIdx + 3; j++) {
        regionVals.push(puzzleMatrix[i][j]);
        if (puzzleMatrix[i][j] == val) return false;
      }
    }
    return true;
  }

  //Check row validation straight from puzzle string (1-based index)
  checkRowPlacement(puzzleString, row, column, value) {
    let rowStartIndex = (row - 1) * 9;
    let rowEndIndex = 2 * 9 - 1;
    let rowVals = puzzleString.slice(rowStartIndex, rowStartIndex + 9);
    if (rowVals.indexOf(value) < 0) return true;
    else return column == rowVals.indexOf(value) + 1;
  }

  //Check col validation straight from puzzle string (1-based index)
  checkColPlacement(puzzleString, row, column, value) {
    let colVals = puzzleString
      .split("")
      .filter((elem, i) => {
        return i % 9 == column - 1;
      })
      .join("");
    if (colVals.indexOf(value) < 0) return true;
    else {
      return row == colVals.indexOf(value) + 1;
    }
  }

  //Check region validation straight from puzzle string (1-based index)
  checkRegionPlacement(puzzleString, row, column, value) {
    // determine (top left) coordinates of the square
    let rowIdx = Math.floor((row - 1) / 3) * 3;
    let colIdx = Math.floor((column - 1) / 3) * 3;

    // clear and set up matrix
    let sudokuMatrix = [];
    for (let i = 0; i < 9; i++) {
      sudokuMatrix.push(puzzleString.slice(i * 9, i * 9 + 9).split(""));
    }
    // console.log(sudokuMatrix);
    let regionVals = [];
    for (let i = rowIdx; i < rowIdx + 3; i++) {
      for (let j = colIdx; j < colIdx + 3; j++) {
        regionVals.push(sudokuMatrix[i][j]);
      }
    }
    regionVals = regionVals.join("");
    // console.log(`Square with row = ${row} and col = ${column}: ${regionVals}`);
    if (regionVals.indexOf(value) < 0) return true;
    else return sudokuMatrix[row - 1][column - 1] == value;
  }

  // generate puzzle matrix from string
  generateMatrix(puzzleString) {
    let puzzleMatrix = [];
    for (let i = 0; i < 9; i++) {
      puzzleMatrix.push(puzzleString.slice(i * 9, i * 9 + 9).split(""));
    }
    return puzzleMatrix;
  }
  generateSolutionString(solutionMatrix) {
    let solutionString = "";
    for (let i = 0; i < 9; i++) {
      solutionString += solutionMatrix[i].join("");
    }
    return solutionString;
  }

  // validate and solve puzzle
  solve(puzzleString) {
    let isValid = this.validate(puzzleString);
    if (isValid != true) return this.validate(puzzleString);
    else {
      let puzzleMatrix = this.generateMatrix(puzzleString);
      let solution = this.solvePuzzle(puzzleMatrix, 0, 0);
      return solution
        ? { solution: this.generateSolutionString(solution) }
        : { error: "Puzzle cannot be solved" };
    }
  }

  // solve logic function
  solvePuzzle(puzzleMatrix, row, col) {
    let solutionMatrix = puzzleMatrix;
    // reset col when we reach the end of the matrix cols
    if (col == 9) {
      col = 0;
      row++;
    }
    // return the matrix when we reach the end of the matrix rows
    if (row == 9) {
      return solutionMatrix;
    }
    // move to next entry if the current one is a number
    if (solutionMatrix[row][col] != ".")
      return this.solvePuzzle(solutionMatrix, row, col + 1);

    // check values for the cell
    for (let i = 1; i < 10; i++) {
      if (
        this.checkRow(solutionMatrix, row, i.toString()) &&
        this.checkCol(solutionMatrix, col, i.toString()) &&
        this.checkRegion(solutionMatrix, row, col, i.toString())
      ) {
        solutionMatrix[row][col] = i.toString();
        if (this.solvePuzzle(solutionMatrix, row, col + 1) != false)
          return this.solvePuzzle(solutionMatrix, row, col + 1);
        else solutionMatrix[row][col] = ".";
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;
