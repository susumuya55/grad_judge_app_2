import { Router } from "express";
import evaluate from "../evaluator"; // evaluatorがtsならOK。jsなら後述の注意

const router = Router();

// POST /judge
router.post("/", (req, res) => {
  try {
    const requestData = req.body;
    const result = evaluate(requestData);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
