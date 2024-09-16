import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelbin.me/";

const agents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
];

// GET THE HOTTEST NOVELS
export const HOT_NOVELS = (req, res, next) => {
  axios
    .get(url, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const hot = [];

      $(".item", html).each(function () {
        const title = $(this).find("img").attr("alt");
        const link = $(this).find("a").attr("href");
        const img = $(this).find("img").attr("data-src");

        hot.push({
          title,
          link,
          img,
        });
      });

      res.status(200).json(hot);
    })
    .catch((err) => res.json({ error: err }));
};

// GET LATEST NOVELS
export const LATEST_NOVELS = (req, res, next) => {
  axios
    .get(url, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const latest = [];

      $(".list.index-novel > .row", html).each(function () {
        const title = $(this).find("h3").text();
        const link = $(this).find("a").attr("href");
        const genres = $(this).find(".col-genre").text();
        const latest_chapter = $(this).find(".text-info").text();
        const latest_chapter_link = $(this)
          .find(".text-info")
          .find("a")
          .attr("href");
        const update_time = $(this).find(".col-time").text();

        latest.push({
          title,
          link,
          genres,
          latest_chapter,
          latest_chapter_link,
          update_time,
        });
      });

      res.status(200).json(latest);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET COMPLETED NOVELS
export const COMPLETED_NOVELS = (req, res, next) => {
  axios
    .get(url, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const completed = [];

      $(".list.list-thumb > .row a", html).each(function () {
        const title = $(this).attr("title");
        const link = $(this).attr("href");
        const img = $(this).find("img").attr("data-src");
        const count = $(this).find("small").text();

        completed.push({
          title,
          link,
          img,
          count,
        });
      });

      res.status(200).json(completed);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET NOVELS BY KEYWORDS
export const GET_NOVEL_BY_KEYWORDS = (req, res, next) => {
  const key = req.params.key;
  const page = req.params.page;
  const newKey = key.replaceAll(" ", "+");
  let newUrl = url + "search?keyword=" + newKey + "&page=" + page;
  if (page === 1) {
    newUrl = url + "search?keyword=" + newKey;
  }

  axios
    .get(newUrl, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const search_req = [];
      const pagination = parseInt($("li.last > a").attr("href").split("=")[2]);

      search_req.push({ pagination });

      $(".list.list-novel > .row", html).each(function () {
        const title = $(this).find(".novel-title").text();
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

        if (
          title === "" ||
          link === "" ||
          author === "" ||
          img === "" ||
          latest_chapter === ""
        ) {
          return;
        } else {
          search_req.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
          });
        }
      });

      res.status(200).json(search_req);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET NOVELS DETAILS AND DESCRIPTION
export const GET_NOVEL_DESC = (req, res, next) => {
  const { link } = req.body;

  axios
    .get(link, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const novel_description = [];

      $(".col-novel-main", html).each(function () {
        const img = $(this).find("img.lazy").attr("data-src");
        const title = $(this).find("img.lazy").attr("alt");
        const description = $(this)
          .find("div.desc-text")
          .text()
          .replaceAll("\n", "");

        const latest_chapter = $(this)
          .find(".item-value")
          .text()
          .replaceAll("\n", "");
        let latest_chapter_link = $(this).find(".item-value > a").attr("href");
        latest_chapter_link =
          "https://novelsbin.novelmagic.org/book/" +
          latest_chapter_link.split("/")[4] +
          "/" +
          latest_chapter_link.split("/")[5];
        const update_time = $(this).find(".item-time").text();

        const first_chapter_title = $(".list-chapter > li > a", html)
          .first()
          .text()
          .replaceAll("\n", "");
        let first_chapter_link = $(".list-chapter > li > a", html)
          .first()
          .attr("href");
        first_chapter_link =
          "https://novelsbin.novelmagic.org/book/" +
          first_chapter_link.split("/")[4] +
          "/" +
          first_chapter_link.split("/")[5];

        novel_description.push({
          id: "",
          img,
          title,
          attr: [],
          description,
          first_chapter_title,
          first_chapter_link,
          latest_chapter,
          latest_chapter_link,
          update_time,
        });

        $(this)
          .find("ul.info.info-meta > li")
          .each(function () {
            const label = $(this).text().split(":")[0].trim();
            const value = $(this).text().split(":")[1].trim();

            novel_description[0].attr.push({
              label,
              value: value.replace("See more »", "").replaceAll("\n", ""),
            });

            if (label == "Year of publishing") {
              const id = title.replaceAll(" ", "").toLowerCase() + value;
              novel_description[0].id = id;
            }
          });
      });

      res.status(200).json(novel_description);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET NEXT AND PREV CHAPTERS LINKS
export const GET_PREV_NEXT_CHAPTER = (req, res, next) => {
  const { link } = req.body;

  axios
    .get(link.replace("novelsbin.novelmagic.org", "novelbin.phieuvu.com"), {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const navigation_links = [];

      let prev_isDisabled = $("#prev_chap", html).attr("disabled");
      let prev_link = $("#prev_chap", html).attr("href");
      let prev_title = $("#prev_chap", html).attr("title");

      let next_isDisabled = $("#next_chap", html).attr("disabled");
      let next_link = $("#next_chap", html).attr("href");
      let next_title = $("#next_chap", html).attr("title");

      prev_isDisabled === undefined
        ? (prev_isDisabled = false)
        : (prev_isDisabled = true);
      next_isDisabled === undefined
        ? (next_isDisabled = false)
        : (next_isDisabled = true);

      navigation_links.push(
        {
          prev_isDisabled,
          prev_link,
          prev_title,
        },
        {
          next_isDisabled,
          next_link,
          next_title,
        }
      );

      res.status(200).json(navigation_links);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// GET CHAPTER CONTENTS
export const GET_CHAPTER_CONTENTS = (req, res, next) => {
  const { link } = req.body;

  axios
    .get(link.replace("novelsbin.novelmagic.org", "novelbin.phieuvu.com"), {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const chapter_contents = [];
      let count = 0;

      $("#chr-content > p", html).each(function () {
        count++;

        chapter_contents.push({
          p: $(this).text(),
        });
      });

      res.status(200).json(chapter_contents);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// ? function that will fetch all latest/hot/completed novels along with their pagination pages count
export const GET_ALL_HOT_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const hot_url = "https://novelbin.me/sort/novelbin-hot";

  axios
    .get(hot_url + "?page=" + page, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const hot_novels = [];
      const pagination = parseInt($("li.last > a").attr("href").split("=")[1]);

      hot_novels.push({ pagination });

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
          hot_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
          });
        }
      });

      res.status(200).json(hot_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
export const GET_ALL_LATEST_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const latest_url = "https://novelbin.me/sort/novelbin-daily-update";

  axios
    .get(latest_url + "?page=" + page, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const latest_novels = [];
      const pagination = parseInt($("li.last > a").attr("href").split("=")[1]);

      latest_novels.push({ pagination });

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
          latest_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
          });
        }
      });

      res.status(200).json(latest_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
export const GET_ALL_COMPLETED_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const completed_url = "https://novelbin.me/sort/novelbin-complete";

  axios
    .get(completed_url + "?page=" + page, {
      headers: {
        "User-Agent": agents[Math.floor(Math.random() * agents.length)],
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,en;q=0.8",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest:": "document",
        "Sec-Fetch-Mode:": "navigate",
        "Sec-Fetch-User:": "?1",
        "Sec-Fetch-Site:": "none",
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const completed_novels = [];
      const pagination = parseInt($("li.last > a").attr("href").split("=")[1]);

      completed_novels.push({ pagination });

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
          completed_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
          });
        }
      });

      res.status(200).json(completed_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// ! WARNING: DO NOT REMOVE
// export const GET_PREV_NEXT_CHAPTER = (req, res, next) => {
//   const { link } = req.body;

//   axios.get(link + "#tab-chapters-title")
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       // const novel_chapters = [];

//       // ? 30 CHAPTERS ONLY
//       // $(".list-chapter > li > a", html).each(function () {
//       //   const title = $(this).text().replaceAll("\n", "");
//       //   const link = $(this).attr("href");

//       //   novel_chapters.push({
//       //     title,
//       //     link,
//       //   });
//       // });

//       // ? 1st CHAPTER ONLY
//       // novel_chapters.push({
//       //   title: $(".list-chapter > li > a", html)
//       //     .first()
//       //     .text()
//       //     .replaceAll("\n", ""),
//       //   link: $(".list-chapter > li > a", html).first().attr("href"),
//       // });

//       // res.status(200).json(novel_chapters);
//     })
//     .catch((err) => res.status(403).json({ error: err }));
// };
