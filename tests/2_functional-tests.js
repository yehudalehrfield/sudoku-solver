const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const {
  validPuzzlesAndSolutions,
  testingPuzzleStringsAndSolution,
} = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Solve API Route", () => {
    test("Valid Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testingPuzzleStringsAndSolution[0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "solution",
            "Response should contain a solution property"
          );
          assert.equal(
            res.body.solution,
            testingPuzzleStringsAndSolution[5],
            "Solution should match solution string"
          );
          done();
        });
    });
    test("Missing Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Required field missing",
            "Error should address missing required field"
          );
          done();
        });
    });
    test("Invalid Characters Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testingPuzzleStringsAndSolution[1] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Invalid characters in puzzle",
            "Error should address missing invalid characters"
          );
          done();
        });
    });
    test("Incorrect Length Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testingPuzzleStringsAndSolution[2] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
            "Error should address missing incorrect length"
          );
          done();
        });
    });
    test("Cannot be solved Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testingPuzzleStringsAndSolution[4] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Puzzle cannot be solved",
            "Error should address puzzle which cannot be solved"
          );
          done();
        });
    });
  });
  suite("Check API Route", () => {
    test("Check puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          done();
        });
    });
    test("Check puzzle placement with single placement conflict", (done) => {
      //row conflict
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "G5",
          value: "9",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          assert.property(
            res.body,
            "conflict",
            "Response should contain a conflict property"
          );
          assert.equal(
            res.body.valid,
            false,
            "Conflict should result in false validity"
          );
          assert.include(
            res.body.conflict,
            "row",
            "Conflict array should include row conflict"
          );
          // done();
        });
      // column conflict
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "C7",
          value: "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          assert.property(
            res.body,
            "conflict",
            "Response should contain a conflict property"
          );
          assert.equal(
            res.body.valid,
            false,
            "Conflict should result in false validity"
          );
          assert.include(
            res.body.conflict,
            "column",
            "Conflict array should include column conflict"
          );
          // done();
        });
      // region conflict
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "H7",
          value: "9",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          assert.property(
            res.body,
            "conflict",
            "Response should contain a conflict property"
          );
          assert.equal(
            res.body.valid,
            false,
            "Conflict should result in false validity"
          );
          assert.equal(
            res.body.conflict.length,
            1,
            "Conflict array should have one element"
          );
          assert.include(
            res.body.conflict,
            "region",
            "Conflict array should include region conflict"
          );
          done();
        });
    });
    test("Check puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "H9",
          value: "9",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          assert.property(
            res.body,
            "conflict",
            "Response should contain a conflict property"
          );
          assert.equal(
            res.body.valid,
            false,
            "Conflict should result in false validity"
          );
          assert.equal(
            res.body.conflict.length,
            2,
            "Conflict array should have two elements"
          );
          assert.includeMembers(
            res.body.conflict,
            ["column", "region"],
            "Conflict array should include column and region conflict"
          );
        });
      done();
    });
    test("Check puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "F8",
          value: "9",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "valid",
            "Response should contain a valid property"
          );
          assert.property(
            res.body,
            "conflict",
            "Response should contain a conflict property"
          );
          assert.equal(
            res.body.valid,
            false,
            "Conflict should result in false validity"
          );
          assert.equal(
            res.body.conflict.length,
            3,
            "Conflict array should have three elements"
          );
          assert.includeMembers(
            res.body.conflict,
            ["row", "column", "region"],
            "Conflict array should include row, column, and region conflict"
          );
          done();
        });
    });
    test("Check puzzle placement with missing required fields", (done) => {
      // missing puzzle
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "", coordinate: "A1", value: "7" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain a error property"
          );
          assert.equal(
            res.body.error,
            "Required field(s) missing",
            "Error should indicate missing required field"
          );
        });
      // missing coordinate
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain a error property"
          );
          assert.equal(
            res.body.error,
            "Required field(s) missing",
            "Error should indicate missing required field"
          );
        });
      // missing value
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "A1",
          value: "",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain a error property"
          );
          assert.equal(
            res.body.error,
            "Required field(s) missing",
            "Error should indicate missing required field"
          );
        });
      done();
    });
    test("Check puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[1],
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Invalid characters in puzzle",
            "Error should indicate invalid characters"
          );
          done();
        });
    });
    test("Check puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[2],
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
            "Error should indicate invalid string length"
          );
          done();
        });
    });
    test("Check puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "W1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Invalid coordinate",
            "Error should indicate invalid coordinate"
          );
          done();
        });
    });
    test("Check puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testingPuzzleStringsAndSolution[0],
          coordinate: "A1",
          value: "11",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            "error",
            "Response should contain an error property"
          );
          assert.equal(
            res.body.error,
            "Invalid value",
            "Error should indicate invalid value"
          );
          done();
        });
    });
  });
});
