import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://novelfull.net";

const agents = [
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36,gzip(gfe)",
  "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const hot = [];

      $(".item", html).each(function () {
        const title = $(this).find("img").attr("alt");
        const link = $(this).find("a").attr("href");
        const img = $(this).find("img").attr("src");

        hot.push({
          title,
          link: url + link,
          img: url + img,
        });
      });

      res.status(200).json(hot);
    })
    .catch((err) => res.status(403).json({ error: err }));
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const latest = [];

      $(".list.index-intro > .row", html).each(function () {
        const title = $(this).find("h3").text();
        const link = $(this).find("a").attr("href");
        const genres = $(this).find(".col-cat").text();
        const latest_chapter = $(this).find(".text-info").text();
        const latest_chapter_link = $(this)
          .find(".text-info")
          .find("a")
          .attr("href");
        const update_time = $(this).find(".col-time").text();
        const label_hot = $(this).find(".col-title > .label-hot").get(0)
          ? true
          : false;
        const label_full = $(this).find(".col-title > .label-full").get(0)
          ? true
          : false;
        const label_new = $(this).find(".col-title > .label-new").get(0)
          ? true
          : false;

        latest.push({
          title,
          link: url + link,
          genres,
          latest_chapter,
          latest_chapter_link: url + latest_chapter_link,
          update_time,
          label_hot,
          label_full,
          label_new,
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const completed = [];

      $(".list.list-thumbnail > .row a", html).each(function () {
        const title = $(this).attr("title");
        const link = $(this).attr("href");
        const img = $(this).find("img").attr("src");
        const count = $(this).find("small").text();

        completed.push({
          title,
          link: url + link,
          img: url + img,
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
  let newUrl = url + "/search?keyword=" + newKey + "&page=" + page;
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const search_req = [];
      let pagination = $(".pagination-container")
        ?.find(".last > a")
        .attr("href")
        ?.split("page=")[1];

      if (pagination === undefined) {
        pagination = $(".pagination-container")
          ?.find("ul.pagination-sm > li:nth-of-type(9)")
          .text();
      }

      search_req.push({ pagination: parseInt(pagination) });

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
          search_req.push({
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
      },
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const novel_description = [];

      $(".col-truyen-main", html).each(function () {
        const img = url + $(this).find("img").attr("src");
        const title = $(this).find("img").attr("alt");
        const description = $(this)
          .find("div.desc-text")
          .text()
          .replaceAll("\n", "");

        const latest_chapter = $(this)
          .find("ul.l-chapters > li:first-of-type > a")
          .text()
          .replaceAll("\n", "");
        const latest_chapter_link =
          url +
          $(this).find("ul.l-chapters > li:first-of-type > a").attr("href");
        const update_time = "";

        const first_chapter_title = $(this)
          .find("ul.list-chapter > li:first-of-type > a")
          .first()
          .text()
          .replaceAll("\n", "");
        const first_chapter_link =
          url +
          $(this)
            .find("ul.list-chapter > li:first-of-type > a")
            .first()
            .attr("href");

        let rating = $(this)
          .find(".desc > .small")
          .text()
          .split(/[/\s]+/);
        rating = rating.filter((el) => !isNaN(parseFloat(el)));
        rating = rating.map((el) => parseFloat(el));

        novel_description.push({
          id: "",
          img,
          title,
          rating,
          attr: [],
          description,
          first_chapter_title,
          first_chapter_link,
          latest_chapter,
          latest_chapter_link,
          update_time,
        });

        $(this)
          .find(".info-holder > .info > div")
          .each(function () {
            const label = $(this).text().split(":")[0].trim();
            const value = $(this).text().split(":")[1].trim();

            novel_description[0].attr.push({
              label,
              value: value.replace("See more »", "").replaceAll("\n", ""),
            });

            if (label == "Author") {
              const id =
                title.replaceAll(" ", "").toLowerCase() +
                "_" +
                value.replaceAll(" ", "").replaceAll(",", "_").toLowerCase();
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
    .get(link, {
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
      const navigation_links = [];

      let prev_isDisabled = $("#prev_chap", html).attr("disabled");
      let prev_link = url + $("#prev_chap", html).attr("href");
      let prev_title = $("#prev_chap", html).attr("title");

      let next_isDisabled = $("#next_chap", html).attr("disabled");
      let next_link = url + $("#next_chap", html).attr("href");
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
    .get(link, {
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
      const chapter_contents = [];
      // let count = 0;

      $("#chapter-content > *", html).each(function () {
        // count++;

        const name = $(this).get(0).name;
        const className = $(this).get(0).attribs.class;
        console.log(className);

        if (name === "p") {
          chapter_contents.push({
            p: $(this).prop("innerHTML"),
          });
        } else if (name === "ul") {
          chapter_contents.push({
            ul: $(this).prop("innerHTML"),
          });
        } else {
          if (className === "ads") {
            chapter_contents.push({
              other: $(this).text(),
            });
          } else {
            chapter_contents.push({
              other: $(this).prop("innerHTML"),
            });
          }
        }
      });

      res.status(200).json(chapter_contents);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// ? function that will fetch all latest/hot/completed novels along with their pagination pages count
export const GET_ALL_HOT_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const hot_url = "https://novelfull.net/hot-novel";

  axios
    .get(hot_url + "?page=" + page, {
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
      const hot_novels = [];
      let pagination = $(".pagination-container")
        ?.find(".last > a")
        .attr("href")
        ?.split("page=")[1];

      if (pagination === undefined) {
        pagination = $(".pagination-container")
          ?.find("ul.pagination-sm > li:nth-of-type(9)")
          .text();
      }

      hot_novels.push({ pagination: parseInt(pagination) });

      $(".list.list-truyen > .row", html).each(function () {
        const title = $(this).find(".truyen-title").text();
        const link = url + $(this).find(".truyen-title > a").attr("href");
        const author = $(this).find("span.author").text();
        const img = url + $(this).find("img").attr("src");
        const latest_chapter =
          url + $(this).find(".text-info").find("a").attr("href");
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
          hot_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
            label_hot,
            label_full,
            label_new,
          });
        }
      });

      res.status(200).json(hot_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
export const GET_ALL_LATEST_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const latest_url = "https://novelfull.net/latest-release-novel";

  axios
    .get(latest_url + "?page=" + page, {
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
      const latest_novels = [];
      let pagination = $(".pagination-container")
        ?.find(".last > a")
        .attr("href")
        ?.split("page=")[1];

      if (pagination === undefined) {
        pagination = $(".pagination-container")
          ?.find("ul.pagination-sm > li:nth-of-type(9)")
          .text();
      }

      latest_novels.push({ pagination: parseInt(pagination) });

      $(".list.list-truyen > .row", html).each(function () {
        const title = $(this).find(".truyen-title").text();
        const link = url + $(this).find(".truyen-title > a").attr("href");
        const author = $(this).find("span.author").text();
        const img = url + $(this).find("img").attr("src");
        const latest_chapter =
          url + $(this).find(".text-info").find("a").attr("href");
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
          latest_novels.push({
            title,
            link,
            author,
            img,
            latest_chapter,
            latest_chapter_title,
            label_hot,
            label_full,
            label_new,
          });
        }
      });

      res.status(200).json(latest_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
export const GET_ALL_COMPLETED_NOVELS = (req, res, next) => {
  const { page } = req.params;
  const completed_url = "https://novelfull.net/completed-novel";

  axios
    .get(completed_url + "?page=" + page, {
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
      const completed_novels = [];
      let pagination = $(".pagination-container")
        ?.find(".last > a")
        .attr("href")
        ?.split("page=")[1];

      if (pagination === undefined) {
        pagination = $(".pagination-container")
          ?.find("ul.pagination-sm > li:nth-of-type(9)")
          .text();
      }

      completed_novels.push({ pagination: parseInt(pagination) });

      $(".list.list-truyen > .row", html).each(function () {
        const title = $(this).find(".truyen-title").text();
        const link = url + $(this).find(".truyen-title > a").attr("href");
        const author = $(this).find("span.author").text();
        const img = url + $(this).find("img").attr("src");
        const count = $(this).find(".text-info").text();
        const label_hot = $(this).find(".label-hot").get(0) ? true : false;
        const label_full = $(this).find(".label-full").get(0) ? true : false;
        const label_new = $(this).find(".label-new").get(0) ? true : false;

        if (
          title === "" ||
          link === "" ||
          author === "" ||
          img === "" ||
          count === ""
        ) {
          return;
        } else {
          completed_novels.push({
            title,
            link,
            author,
            img,
            count,
            label_hot,
            label_full,
            label_new,
          });
        }
      });

      res.status(200).json(completed_novels);
    })
    .catch((err) => res.status(403).json({ error: err }));
};

// ? GET CHAPTERS OF THE NOVEL
export const GET_NOVEL_CHAPTERS = (req, res, next) => {
  const { link } = req.body;
  const { page } = req.params;

  axios
    .get(link + "?page=" + page, {
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
      const novel_chapters = [];
      let pagination = $("#list-chapter")
        ?.find(".last > a")
        .attr("href")
        ?.split("=")[1];

      if (pagination === undefined) {
        pagination = $("#list-chapter")
          ?.find("ul.pagination-sm > li:nth-of-type(9) > a")
          .text();
      }

      novel_chapters.push({ pagination: parseInt(pagination) });

      $(".list-chapter > li > a", html).each(function () {
        const chapter = $(this).text().replaceAll("\n", "");
        const link = url + $(this).attr("href");

        novel_chapters.push({
          chapter,
          link,
        });
      });

      res.status(200).json(novel_chapters);
    })
    .catch((err) => res.status(403).json({ error: err }));
};
