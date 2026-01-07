const express = require("express");
const router = express.Router();

const evaluate = require("../evaluator");
const prisma = require("../prismaClient");

// POST /judge
router.post("/", async (req, res) => {
  try {
    const requestData = req.body;

    const result = evaluate(requestData);

    // ★ DBに保存（匿名・丸ごと）
    await prisma.gradJudgeData.create({
      data: {
        payload: {
          input: requestData,
          result: result
        }
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

module.exports = router;
