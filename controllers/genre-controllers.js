import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelbin.me/";

const config = {
  headers: {
    Accept: [
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    ],
    "Accept-Encoding": ["gzip, deflate, br, zstd"],
    "Accept-Language": ["en-US,en;q=0.9"],
    Connection: ["keep-alive"],
    Host: ["httpbin.io"],
    "Sec-Ch-Ua": [
      '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    ],
    "Sec-Ch-Ua-Mobile": ["?0"],
    "Sec-Ch-Ua-Platform": ['"Windows"'],
    "Sec-Fetch-Dest": ["document"],
    "Sec-Fetch-Mode": ["navigate"],
    "Sec-Fetch-Site": ["none"],
    "Sec-Fetch-User": ["?1"],
    "Upgrade-Insecure-Requests": ["1"],
    "User-Agent": [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    ],
  },
};

// ALL GENRES
export const GENRES = (req, res, next) => {
  axios(url, config)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const genres = [];

      $("#new-genre-select > option", html).each(function () {
        const genre = $(this).attr("value");
        const link =
          "https://novelbin.me/novelbin-genres/" +
          genre.replaceAll(" ", "-").toLowerCase();

        genres.push({
          genre,
          link,
        });
      });

      res.status(200).json(genres);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET NOVELS WITH A SPECIFIC GENRE
export const GET_NOVEL_WITH_THIS_GENRE = (req, res, next) => {
  const req_genre = req.params.genre;
  const req_page = req.params.page;

  axios(url + "novelbin-genres/" + req_genre + "?page=" + req_page, config)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const req_novels = [];
      const pagination = parseInt($("li.last > a").attr("href").split("=")[1]);

      req_novels.push({ pagination });

      $(".list.list-novel > .row", html).each(function () {
        const title = $(this).find(".novel-title").text();
        const link = $(this).find("a").attr("href");
        const author = $(this).find("span.author").text();
        const img = $(this).find("img").attr("data-src");
        const latest_chapter = $(this)
          .find(".text-info")
          .find("a")
          .attr("href");
        const latest_chapter_title = $(this)
          .find(".text-info")
          .find("a")
          .attr("title");

        if (
          title === "" ||
          link === "" ||
          author === "" ||
          img === "" ||
          latest_chapter === ""
        ) {
          return;
        } else {
          req_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
          });
        }
      });

      res.status(200).json(req_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
