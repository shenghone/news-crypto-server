import express from "express";
import axios from "axios";
import { getLinkPreview } from "link-preview-js";
require("dotenv").config();

const router = express.Router();
const TOP_HEADLINES = [
  "general",
  "health",
  "technology",
  "sports",
  "business",
  "science",
  "entertainment",
];

router.get("/", async (req, res) => {
  let d;
  let doubleCheckedArticles;
  try {
    const {
      query: { page, category = "general", keyword },
    } = req;
    //non-crypto

    if (TOP_HEADLINES.includes(category)) {
      const { data } = keyword
        ? await axios.get(
            `http://newsapi.org/v2/top-headlines?category=${category}` +
              `&country=ca` +
              `&page=${page}` +
              `&q=${keyword}` +
              `&apiKey=${process.env.NEWS_KEY}`
          )
        : await axios.get(
            `http://newsapi.org/v2/top-headlines?category=${category}` +
              `&country=ca` +
              `&page=${page}` +
              `&apiKey=${process.env.NEWS_KEY}`
          );

      d = data;

      //cryptocurrency
    } else if (category === "cryptocurrency") {
      const { data } =
        keyword && keyword !== ""
          ? await axios.get(
              `http://newsapi.org/v2/everything?q=%28cryptocurrency%20and%20${keyword}%29` +
                `&language=en` +
                `&sortBy=publishedAt` +
                `&page=${page}` +
                `&apiKey=${process.env.NEWS_KEY}`
            )
          : await axios.get(
              `http://newsapi.org/v2/everything?q=cryptocurrency` +
                `&language=en` +
                `&sortBy=publishedAt` +
                `&page=${page}` +
                `&apiKey=${process.env.NEWS_KEY}`
            );
      d = data;
    }
    const { articles } = d;
    const getImage = async (link) => {
      try {
        const { images } = await getLinkPreview(link);
        if (images) {
          return images[0];
        }
        return;
      } catch (err) {
        console.error(err);
      }
      return;
    };
    doubleCheckedArticles = articles.reduce((previousResult, news) => {
      if (news.urlToImage) {
        return previousResult.concat(news);
      } else {
        return previousResult.concat({
          ...news,
          urlToImage: getImage(news.url),
        });
      }
    }, []);

    //newsapi.org/v2/top-headlines?country=us&apiKey=c593132c2e4c43799c7767555ad39b31
  } catch (err) {
    console.error(err);
  }

  res.send({
    ...d,
    articles: doubleCheckedArticles,
  });
});

export default router;
