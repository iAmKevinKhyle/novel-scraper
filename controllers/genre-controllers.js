import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelbin.me/";

const agents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
];

// ALL GENRES
export const GENRES = (req, res, next) => {
  axios
    .get(url, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "same-origin",
      },
    })
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

  axios
    .get(url + "novelbin-genres/" + req_genre + "?page=" + req_page, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "same-origin",
      },
    })
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
