import express from "express";
import cryptoRoute from "./routes/cryptoRoute";
import topHeadlinesRoute from "./routes/topHeadlinesRoute";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 8082;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/", async (req, res) => {
  res.send("<h4>welcome</h4>");
});
app.use("/crypto", cryptoRoute);
app.use("/top-headlines", topHeadlinesRoute);

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
