const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  // valid, invalid chars, invalid length
  let puzzleStrings = [
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9...a..1945....4.37.4.3..6..",
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....1945....4.37.4.3..6..",
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....1945....4.37.4.3..6....",
  ];
  let puzzleSolution =
    "769235418769235418769235418769235418769235418769235418769235418769235418769235418";

  suite("Validation", () => {
    test("Valid Puzzle String", (done) => {
      assert.isTrue(
        solver.validate(puzzleStrings[0]),
        "Valid puzzle string should be true"
      );
      done();
    });
    test("Invalid Characters", (done) => {
      assert.property(
        solver.validate(puzzleStrings[1]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(puzzleStrings[1]).error,
        "Invalid characters in puzzle",
        "Should invalidate for invalid characters"
      );
      done();
    });
    test("Less than 81 characters", (done) => {
      assert.property(
        solver.validate(puzzleStrings[2]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(puzzleStrings[2]).error,
        "Expected puzzle to be 81 characters long",
        "Should invalidate for string less than 81 characters"
      );
      done();
    });
    test("More than 81 characters", (done) => {
      assert.property(
        solver.validate(puzzleStrings[3]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(puzzleStrings[3]).error,
        "Expected puzzle to be 81 characters long",
        "Should invalidate for string more than 81 characters"
      );
      done();
    });
  });
  suite("Row Placement", () => {
    test("Valid Row Placement", (done) => {
      assert.isTrue(solver.checkRowPlacement(puzzleStrings[0], 1, 1, 7));
      done();
    });
    test("Invalid Row Placement", (done) => {
      assert.isFalse(solver.checkRowPlacement(puzzleStrings[0], 8, 7, 5));
      done();
    });
  });
  suite("Column Placement", () => {
    test("Valid Column Placement", (done) => {
      assert.isTrue(solver.checkColPlacement(puzzleStrings[0], 2, 5, 9));
      done();
    });
    test("Invalid Column Placement", (done) => {
      assert.isFalse(solver.checkColPlacement(puzzleStrings[0], 7, 3, 2));
      done();
    });
  });
  suite("Region Placement", () => {
    test("Valid Region Placement", (done) => {
      assert.isTrue(solver.checkRegionPlacement(puzzleStrings[0], 2, 7, 3));
      done();
    });
    test("Valid Region Placement", (done) => {
      assert.isFalse(solver.checkRegionPlacement(puzzleStrings[0], 6, 7, 3));
      done();
    });
  });
  suite("Puzzle Solution", () => {
    test("Valid Strings Pass Solver", (done) => {
      assert.isArray(solver.solve(puzzleStrings[0]));
      done();
    });
    test("Invalid Strings Do Not Pass Solver", (done) => {
      assert.property(solver.solve(puzzleStrings[1]), "error");
      done();
    });
    test("Valid Strings Pass Solver", (done) => {
      assert.equal(
        solver.generateSolutionString(solver.solve(puzzleStrings[0])),
        puzzleSolution
      );
      done();
    });
  });
});
