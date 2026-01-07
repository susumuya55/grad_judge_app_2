


const express = require("express");
const router = express.Router();

const evaluate = require("../evaluator");

// POST /judge
router.post("/", (req, res) => {
  try {
    const requestData = req.body;

    const result = evaluate(requestData);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

module.exports = router;
