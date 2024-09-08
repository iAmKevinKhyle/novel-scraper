import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelbin.me/";

// ALL GENRES
export const GENRES = (req, res, next) => {
  axios(url)
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

  axios(url + "novelbin-genres/" + req_genre + "?page=" + req_page)
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
