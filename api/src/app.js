const express = require("express");
const cors = require("cors");

const judgeRouter = require("./routes/judge");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/judge", judgeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Student Judge API running on port ${PORT}`);
});
