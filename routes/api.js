"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();
  let rowVals = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
  let coordRegex = /^[A-I][1-9]$/i;
  let valRegex = /^[1-9]$/;

  app.route("/api/check").post((req, res) => {
    let { puzzle, coordinate, value } = req.body;
    // check for missing field(s)
    if (!puzzle || !coordinate || !value)
      res.json({ error: "Required field(s) missing" });
    // check puzzle validation errors
    else if (solver.validate(puzzle) != true) res.json(solver.validate(puzzle));
    // check coordinate validation error
    else if (!coordRegex.test(coordinate))
      res.json({ error: "Invalid coordinate" });
    // check value validation error
    else if (!valRegex.test(value)) res.json({ error: "Invalid value" });
    // check for valid placement
    else {
      // get row and col
      let row = rowVals[coordinate[0].toUpperCase()];
      let col = Number.parseInt(coordinate[1]);
      let currentVal = puzzle[row * col - 1];
      if (value == currentVal)
        res.json({ value: true }); // "if value is not conflicting?"
      else {
        let rowConflict = solver.checkRowPlacement(puzzle, row, col, value);
        let colConflict = solver.checkColPlacement(puzzle, row, col, value);
        let regConflict = solver.checkRegionPlacement(puzzle, row, col, value);
        let valid = rowConflict && colConflict && regConflict;
        if (valid) {
          res.json({ valid: valid });
        } else {
          let conflicts = [];
          if (!rowConflict) conflicts.push("row");
          if (!colConflict) conflicts.push("column");
          if (!regConflict) conflicts.push("region");
          res.json({ valid: valid, conflict: conflicts });
        }
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzleString = req.body.puzzle;
    if (!puzzleString) res.json({ error: "Required field missing" });
    let result = solver.solve(puzzleString);
    res.json(result);
  });
};
