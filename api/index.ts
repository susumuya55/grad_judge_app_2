import express from "express";
import judgeRouter from "./src/routes/judge"; // index.tsがルートならこう。場所により調整

const app = express();

app.use(express.json());

app.use("/judge", judgeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
