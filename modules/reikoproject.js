import axios from "axios";
import jsdom from "jsdom";
import CompilePlayerData from "../utils/CompileEpisodeData.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function Reiko(anime, episode) {
  const request = axios
    .get(`https://reikoproject.blogspot.com/${anime}.html`, {
      headers: {
        Referer: `https://reikoproject.blogspot.com/${anime}.html`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });
      const items = dom.window.document.querySelectorAll(
        `div[style='font-family: "times new roman";'] i b`
      );

      let episode_url_cleaning = [];

      await Promise.all(
        Array.from(items).map(function (x) {
          if (x.querySelector("a")) {
            const text = x.textContent;
            const link = x.querySelector("a");

            if (!link) return;
            const data = CompilePlayerData(link.href);

            if (data.code === 404) {
              return;
            }

            const matching = text.match(/(\d+)/);
            const defineNumber = Number(matching === null ? 9999 : matching[0]);

            if (defineNumber === Number(episode)) {
              episode_url_cleaning.push({
                player: data.hosting,
                url: data.player_embed,
              });
            }
          }
        })
      );

      if (episode_url_cleaning.length <= 0) {
        return {
          status: 500,
          message: "Something went wrong!",
        };
      }

      return {
        status: 200,
        message: "Success",
        episode_url: episode_url_cleaning,
        episode_next_url: Number(episode) + 1,
      };
    })
    .catch((err) => {
      //console.log(err)
      return {
        status: 500,
        message: "Something went wrong!",
      };
    });

  return request;
}
export default Reiko;
