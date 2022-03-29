import express from "express";
import cryptoRoute from "./routes/cryptoRoute";
import topHeadlinesRoute from "./routes/topHeadlinesRoute";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.get("/", async (req, res) => {
  res.send("<h4>welcome</h4>");
});
app.use("/crypto", cryptoRoute);
app.use("/top-headlines", topHeadlinesRoute);

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
