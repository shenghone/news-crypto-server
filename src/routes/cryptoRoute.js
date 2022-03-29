import express from "express";
import _ from "lodash";
import dayjs from "dayjs";
import { calcDuration, getInterval } from "../util";
import axios from "axios";

const router = express.Router();
const COINPAPRIKA_URL = "https://api.coinpaprika.com/v1/";

router.get("/:period", async ({ params: { period }, query, ...rest }, res) => {
  let periodicalData = [];
  let { cid } = query;
  let topFiveCrypto;
  let error = null;
  let tickers = [];
  console.log("oh yea")
  try {
    const { status: coinStatus, data: coins } = await axios.get(
      COINPAPRIKA_URL + "coins"
    );

    topFiveCrypto = [...coins.slice(0, 5)];

    let coinIDs =
      cid ||
      topFiveCrypto.reduce((ids, coin) => {
        return ids.concat(coin.id);
      }, []);
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const duration = calcDuration(period, today);
    const interval = getInterval(period);

    for (const id of coinIDs) {
      try {
        const { status: historicalStatus, data } = await axios.get(
          `https://api.coinpaprika.com/v1/tickers/${id}/historical?start=${duration}&end=${today}&limit=2000&quote=usd&interval=${interval}`
        );

        periodicalData.push({
          id,
          data,
        });
        const { status: tickerStatus, data: tickersInfo } = await axios.get(
          `https://api.coinpaprika.com/v1/tickers/${id}?quotes=usd`
        );

        tickers.push({
          id,
          ticker: tickersInfo,
        });
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    error = err;
    console.log(err);
  }

  res.json({
    tickers,
    periodicalData,
    topFiveCrypto,
    error,
  });
});

export default router;
