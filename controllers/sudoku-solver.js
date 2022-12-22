class SudokuSolver {
  constructor() {
    this.sudokuMatrix = [];
    this.colVals = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
  }

  validate(puzzleString) {
    // check length of puzzle string
    if (puzzleString.length != 81) return false;
    // check if any characters are not valid
    const invalidSudokuVal = /[^1-9|\.]/g;
    if (invalidSudokuVal.test(puzzleString)) return false;
    else {
      // create matrix
      for (let i = 0; i < 9; i++) {
        this.sudokuMatrix.push(puzzleString.slice(i * 9, i * 9 + 9).split(""));
      }
      return true;
    }

    // Also need to validate if string entry is valid (doubles in row/col/square...) ?
    // if so...
    // create checkRow fct: remove/filter .'s, check for duplicates (Set(filteredRow).size != filteredRow.length
    // create checkCol fct: remove/filter .'s, check for duplicates (Set(filteredCol).size != filteredCol.length
    // create checkRegion fct: remove/filter .'s, check for duplicates (Set(filteredReg).size != filteredReg.length
  }

  // checkCol(col) {}
  // checkRow(row) {}
  // checkRegion(reg) {}

  checkRowPlacement(puzzleString, row, column, value) {
    let rowStartIndex = (row - 1) * 9;
    let rowEndIndex = 2 * 9 - 1;
    let rowVals = puzzleString.slice(rowStartIndex, rowStartIndex + 9);
    console.log(`Row #${row}: ${rowVals}`);
    if (rowVals.indexOf(value) < 0) return true;
    else return column == rowVals.indexOf(value) + 1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colVals = puzzleString
      .split("")
      .filter((elem, i) => {
        return i % 9 == column - 1;
      })
      .join("");
    console.log(`Col #${column}: ${colVals}`);
    if (colVals.indexOf(value) < 0) return true;
    else {
      return row == colVals.indexOf(value) + 1;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // cols 1,2,3: i%9 < 3 ; cols 4,5,6: 3 <= i%9 < 6 ; cols 7,8,9 <= i%9
    // rows 1,2,3: i/9 < 3 ; rows 4,5,6: 3 <= i/9 < 6 ; rows 7,8,9 <= i/9

    // determine (top left) coordinates of the square
    let rowIdx = Math.floor(row / 3) * 3;
    let colIdx = Math.floor(column / 3) * 3;

    let regionVals = [];
    for (let i = rowIdx; i < rowIdx + 3; i++) {
      for (let j = colIdx; j < colIdx + 3; j++) {
        regionVals.push(this.sudokuMatrix[i][j]);
      }
    }
    regionVals = regionVals.join("");
    console.log(`Square with row = ${row} and col = ${column}: ${regionVals}`);
    if (regionVals.indexOf(value) < 0) return true;
    else return this.sudokuMatrix[row - 1][column - 1] == value;
  }

  solve(puzzleString) {
    if (validate(puzzleString)) return "invalid board";
  }
  solveRecursive(puzzleMatrix, row, col) {}
}

let testStrings = [
  ".234567891.345678912.456789123.567891234.678912345.789123456.891234567.912345678.",
  ".111111112.222222233.333333444.444445555.555566666.666777777.778888888.899999999.",
  ".231.312.456456456789789789123123123.564.645.789789789123123123456456456.897.978.",
];
let solver = new SudokuSolver();
testStrings.forEach((elem, i) => {
  console.log(`Puzzle String ${i} Validity: ${solver.validate(elem)}`);
});
console.log(
  `Check Row Validation: ${solver.checkRowPlacement(testStrings[0], 1, 1, 1)}`
);
console.log(
  `Check Col Validation: ${solver.checkColPlacement(testStrings[1], 4, 1, 1)}`
);
console.log(
  `Check Region Validation: ${solver.checkRegionPlacement(
    testStrings[2],
    8,
    1,
    1
  )}`
);

module.exports = SudokuSolver;
