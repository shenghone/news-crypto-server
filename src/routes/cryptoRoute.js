import express from "express";
import _ from "lodash";
import dayjs from "dayjs";
import { calcDuration, getInterval,STABLECOIN_SYMBOLS,mapCoinpaprikaIdToTwelveDataSymbol,mapCoinpaprikaIntervalToTwelveData } from "../util/index.js";
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
  

   

    /*let coinIDs =
      cid ||
      topFiveCrypto.reduce((ids, coin) => {
        return ids.concat(coin.id);
      }, []);


    const interval = getInterval(period);*/

    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const duration = calcDuration(period, today);
    const interval = mapCoinpaprikaIntervalToTwelveData(getInterval(period));
    //get top 5 cryptos from coinpaprika 
    const { data: coins } = await axios.get(
      COINPAPRIKA_URL + "coins"
    );

    topFiveCrypto= coins.slice(0,15).reduce((c,self)=>{
      console.log(c.length)
      const {symbol}  = self;
      if(!STABLECOIN_SYMBOLS.has(symbol.toUpperCase())){
        return c.concat(self)
      }
      return c;
    },[]).slice(0,5);
    console.log(topFiveCrypto);
    let coinIDs =
      cid ||
      topFiveCrypto.reduce((ids, coin) => {
        return ids.concat(coin.id);
      }, [])
    for (const t of topFiveCrypto) {
      try {
     
        const sbl = mapCoinpaprikaIdToTwelveDataSymbol(t.id);
        const tdUrl = `https://api.twelvedata.com/time_series?symbol=${sbl}&interval=${interval}&start_date=${duration}&end_date=${today}&apikey=${process.env.TWELVE_API}&outputsize=5000`;
        console.log("59")
 
        const tdResponse = await axios.get(tdUrl);
        console.log("62")
        console.log(tdResponse)
        const sortedValue = tdResponse.data.values.map(item => ({
          timestamp: item.datetime, // ISO 8601 UTC
          open: parseFloat(item.open).toFixed(2),
          high: parseFloat(item.high).toFixed(2),
          low: parseFloat(item.low).toFixed(2),
          price: parseFloat(item.close).toFixed(2),
          close: parseFloat(item.close).toFixed(2),
          volume: parseFloat(item.volume).toFixed(2),
          value: (parseFloat(item.volume) * parseFloat(item.close)).toFixed(2) // USD value
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time)); // Ascending, per Coinpaprika
        periodicalData.push({
          id:t.id,
          data:sortedValue
        });
        const { data: tickersInfo } = await axios.get(
          `https://api.coinpaprika.com/v1/tickers/${t.id}?quotes=usd`
        );
        tickers.push({
          id:t.id,
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