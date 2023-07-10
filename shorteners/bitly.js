import axios from "axios";
import jsdom from "jsdom";
import CompilePlayerData from "../utils/CompileEpisodeData.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default function bitly(url) {
  const request = axios
    .get(`${url}+`, {
      headers: {
        Referer: `${url}+`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });
      const player = dom.window.document.querySelector(
        ".bitlink--destination-url"
      );

      if (!player) {
        return {
          status: 500,
          message: "Something went wrong!",
        };
      }

      const data = CompilePlayerData(player.querySelector("a").href);

      if ([404, 501].includes(data.code)) {
        return {
          status: 500,
          message: "Something went wrong!",
        };
      }

      return {
        status: 200,
        message: "Success",
        episode_url: [
          {
            player: data.hosting,
            url: data.player_embed,
          },
        ],
        episode_next_url: null,
      };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    });

  return request;
}
