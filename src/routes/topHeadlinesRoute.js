import express from "express";
import axios from "axios";
import { getLinkPreview } from "link-preview-js";
import dotenv from "dotenv";
dotenv.config();

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
  console.log("route hit")
  try {
    const {
      query: { page, category = "general", keyword },
    } = req;
    //non-crypto
    console.log("line 27")
    console.log(page,keyword)
    if (TOP_HEADLINES.includes(category)) {
      const { data } = keyword
        ? await axios.get(
            `http://newsapi.org/v2/top-headlines?category=${category}` +
              `&country=us` +
              `&page=${page}` +
              `&q=${keyword}` +
              `&apiKey=${process.env.NEWS_KEY}`
          )
        : await axios.get(
            `http://newsapi.org/v2/top-headlines?category=${category}` +
              `&country=us` +
              `&page=${page}` +
              `&apiKey=${process.env.NEWS_KEY}`
          );

      d = data;
          console.log(`The key for News is :${process.env.NEWS_KEY}`)
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
    console.log("line 67")
    console.log(d);
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
      if(typeof news.urlToImage!=="string"){
        return previousResult
      }
      else if (news.urlToImage) {
        return previousResult.concat(news);
      } else {
        return previousResult.concat({
          ...news,
          urlToImage: getImage(news.url),
        });
      }
    }, []);
  } catch (err) {
    console.error(err);
  }

  res.send({
    ...d,
    articles: doubleCheckedArticles,
  });
});

export default router;
