import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import evaluate from "../evaluator";

const router = Router();
const prisma = new PrismaClient();

// POST /judge
router.post("/", async (req, res) => {
  try {
    const requestData = req.body;

    const result = evaluate(requestData);

    // ===== DB保存（MVP）=====
    await prisma.gradJudgeData.create({
      data: {
        payload: {
          input: requestData,
          result,
        },
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("judge error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
