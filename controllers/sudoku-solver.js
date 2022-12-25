class SudokuSolver {
  validate(puzzleString) {
    // check length of puzzle string
    const invalidSudokuVal = /[^1-9|\.]/g;
    if (invalidSudokuVal.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    if (puzzleString.length != 81)
      return { error: "Expected puzzle to be 81 characters long" };
    // check if any characters are not valid
    return !invalidSudokuVal.test(puzzleString); // may need to return specific issue

    // Also need to validate if string entry is valid (doubles in row/col/square...) ?
    // if so...
    // create checkRow fct: remove/filter .'s, check for duplicates (Set(filteredRow).size != filteredRow.length
    // create checkCol fct: remove/filter .'s, check for duplicates (Set(filteredCol).size != filteredCol.length
    // create checkRegion fct: remove/filter .'s, check for duplicates (Set(filteredReg).size != filteredReg.length
  }

  // FUTURE: Combine the six check function into three (?)
  // Check valid row entry form puzzle matrix (0-based index)
  checkRow(puzzleMatrix, row, val) {
    // console.log(`Row #${row + 1}: ${puzzleMatrix[row]}`);
    // if (puzzleMatrix[row].indexOf(val.toString()) < 0) return true;
    // else return puzzleMatrix[0].indexOf(val.toString()) == col;
    for (let i = 0; i < 9; i++) {
      if (puzzleMatrix[row][i] == val) return false;
    }
    return true;
  }
  // Check valid column entry form puzzle matrix (0-based index)
  checkCol(puzzleMatrix, col, val) {
    // let colVals = [];
    // puzzleMatrix.forEach((elem) => colVals.push(elem[col]));
    // if (colVals.indexOf(val.toString()) < 0) return true;
    // else return colVals.indexOf(val.toString()) == row;
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
    // console.log(`Square with row = ${row} and col = ${col}: ${regionVals}`);
    // if (regionVals.indexOf(val.toString()) < 0) return true;
    // else return puzzleMatrix[row][col] == val.toString();
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
    // if (this.validate(puzzleString != true)) return "invalid board";
    else {
      let puzzleMatrix = this.generateMatrix(puzzleString);
      let solution = this.solvePuzzle(puzzleMatrix, 0, 0);
      return (
        // this.solvePuzzle(puzzleMatrix, 0, 0) || {
        //   error: "Puzzle cannot be solved",
        // }
        solution
          ? { solution: this.generateSolutionString(solution) }
          : { error: "Puzzle cannot be solved" }
      );
    }
  }

  // solve logic function
  solvePuzzle(puzzleMatrix, row, col) {
    // console.log(`Checking cell [${row + 1},${col + 1}]`);
    let solutionMatrix = puzzleMatrix;
    // let solutionMatrix = puzzleMatrix.map((row) => [...row]); // this causes an infinite loop
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
      // process.stdout.write(".");
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

let testStrings = [
  ".234567891.345678912.456789123.567891234.678912345.789123456.891234567.912345678.",
  ".111111112.222222233.333333444.444445555.555566666.666777777.778888888.899999999.",
  ".231.312.456456456789789789123123123.564.645.789789789123123123456456456.897.978.",
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3a.6..",
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....1945....4.37.4.3..6..",
];
let solver = new SudokuSolver();
// testStrings.forEach((elem, i) => {
//   console.log(`Puzzle String ${i} Validity: ${solver.validate(elem)}`);
//   // console.log(solver.generateMatrix(elem));
// });
// console.log(
//   `Row Validation: ${solver.checkRowPlacement(testStrings[0], 1, 1, 1)}`
// );
// console.log(
//   `Col Validation: ${solver.checkColPlacement(testStrings[1], 4, 2, 1)}`
// );
// console.log(
//   `Region Validation: ${solver.checkRegionPlacement(testStrings[3], 9, 9, 9)}`
// );
// console.log(
//   `Matrix Row Validation: ${solver.checkRow(
//     solver.generateMatrix(testStrings[0]),
//     0,
//     0,
//     1
//   )}`
// );
// console.log(
//   `Check Matrix Col Validation: ${solver.checkCol(
//     solver.generateMatrix(testStrings[1]),
//     4,
//     1,
//     1
//   )}`
// );
// console.log(
//   `Check Matrix Region Validation: ${solver.checkRegion(
//     solver.generateMatrix(testStrings[3]),
//     8,
//     8,
//     9
//   )}`
// );
// console.log(
//   solver.solve(
//     "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9..a....1945....4.37.4.3..6.."
//   )
// );
// console.log(solver.solve(testStrings[3]));
// console.log(
//   solver.validate(
//     "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9...a..1945....4.37.4.3..6.."
//   ).error == "Invalid characters in puzzle"
// );
module.exports = SudokuSolver;
//
