import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelfull.net";

const agents = [
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36,gzip(gfe)",
  "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const genres = [];

      $(".list-cat > .row a", html).each(function () {
        const genre = $(this).text();
        const link = url + $(this).attr("href");

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
    .get(url + "/genre/" + req_genre + "?page=" + req_page, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const req_novels = [];
      let pagination = $(".pagination-container")
        ?.find(".last > a")
        .attr("href")
        ?.split("page=")[1];

      if (pagination === undefined) {
        pagination = $(".pagination-container")
          ?.find("ul.pagination-sm > li:nth-of-type(9)")
          .text();

        if (isNaN(parseInt(pagination))) {
          for (let i = 9; i > 0; i--) {
            pagination = $(".pagination-container")
              ?.find(`ul.pagination-sm > li:nth-of-type(${i})`)
              .text();

            if (parseInt(pagination) >= 0) {
              break;
            }
          }
        }
      }

      req_novels.push({ pagination: parseInt(pagination) });

      $(".list.list-truyen > .row", html).each(function () {
        const title = $(this).find(".truyen-title").text();
        const link = $(this).find("a").attr("href");
        const author = $(this).find("span.author").text();
        const img = $(this).find("img").attr("src");
        const latest_chapter = $(this)
          .find(".text-info")
          .find("a")
          .attr("href");
        const latest_chapter_title = $(this)
          .find(".text-info")
          .find("a")
          .attr("title");
        const label_hot = $(this).find(".label-hot").get(0) ? true : false;
        const label_full = $(this).find(".label-full").get(0) ? true : false;
        const label_new = $(this).find(".label-new").get(0) ? true : false;

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
            link: url + link,
            author,
            img: url + img,
            latest_chapter: url + latest_chapter,
            latest_chapter_title,
            label_hot,
            label_full,
            label_new,
          });
        }
      });

      res.status(200).json(req_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
