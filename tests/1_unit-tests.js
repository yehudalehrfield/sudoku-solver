const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const {
  validPuzzlesAndSolutions,
  testingPuzzleStringsAndSolution,
} = require("../controllers/puzzle-strings");
let solver = new Solver();

suite("Unit Tests", () => {
  suite("Validation", () => {
    test("Valid Puzzle String", (done) => {
      assert.isTrue(
        solver.validate(testingPuzzleStringsAndSolution[0]),
        "Valid puzzle string should be true"
      );
      done();
    });
    test("Invalid Characters", (done) => {
      assert.property(
        solver.validate(testingPuzzleStringsAndSolution[1]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(testingPuzzleStringsAndSolution[1]).error,
        "Invalid characters in puzzle",
        "Should invalidate for invalid characters"
      );
      done();
    });
    test("Less than 81 characters", (done) => {
      assert.property(
        solver.validate(testingPuzzleStringsAndSolution[2]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(testingPuzzleStringsAndSolution[2]).error,
        "Expected puzzle to be 81 characters long",
        "Should invalidate for string less than 81 characters"
      );
      done();
    });
    test("More than 81 characters", (done) => {
      assert.property(
        solver.validate(testingPuzzleStringsAndSolution[3]),
        "error",
        "Should have an error"
      );
      assert.equal(
        solver.validate(testingPuzzleStringsAndSolution[3]).error,
        "Expected puzzle to be 81 characters long",
        "Should invalidate for string more than 81 characters"
      );
      done();
    });
  });
  suite("Row Placement", () => {
    test("Valid Row Placement", (done) => {
      assert.isTrue(
        solver.checkRowPlacement(testingPuzzleStringsAndSolution[0], 1, 1, 7)
      );
      done();
    });
    test("Invalid Row Placement", (done) => {
      assert.isFalse(
        solver.checkRowPlacement(testingPuzzleStringsAndSolution[0], 8, 7, 5)
      );
      done();
    });
  });
  suite("Column Placement", () => {
    test("Valid Column Placement", (done) => {
      assert.isTrue(
        solver.checkColPlacement(testingPuzzleStringsAndSolution[0], 2, 5, 9)
      );
      done();
    });
    test("Invalid Column Placement", (done) => {
      assert.isFalse(
        solver.checkColPlacement(testingPuzzleStringsAndSolution[0], 7, 3, 2)
      );
      done();
    });
  });
  suite("Region Placement", () => {
    test("Valid Region Placement", (done) => {
      assert.isTrue(
        solver.checkRegionPlacement(testingPuzzleStringsAndSolution[0], 2, 7, 3)
      );
      done();
    });
    test("Valid Region Placement", (done) => {
      assert.isFalse(
        solver.checkRegionPlacement(testingPuzzleStringsAndSolution[0], 6, 7, 3)
      );
      done();
    });
  });
  suite("Puzzle Solution", () => {
    test("Valid Strings Pass Solver", (done) => {
      assert.property(
        solver.solve(testingPuzzleStringsAndSolution[0]),
        "solution"
      );
      done();
    });
    test("Invalid Strings Do Not Pass Solver", (done) => {
      assert.property(
        solver.solve(testingPuzzleStringsAndSolution[1]),
        "error"
      );
      done();
    });
    test("Solver Returns expected solution", (done) => {
      assert.property(
        solver.solve(testingPuzzleStringsAndSolution[0]),
        "solution"
      );
      assert.equal(
        solver.solve(testingPuzzleStringsAndSolution[0]).solution,
        testingPuzzleStringsAndSolution[5]
      );
      validPuzzlesAndSolutions.forEach((elem) =>
        assert.equal(solver.solve(elem[0]).solution, elem[1])
      );
      done();
    });
  });
});
