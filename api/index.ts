import express, { Request, Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Graduation Judge API (TypeScript)");
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
