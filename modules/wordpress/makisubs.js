import axios from "axios";
import jsdom from "jsdom";
import { MakiSubsAPI } from "../api/index.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function MakiSubs(anime, episode) {
  const request = axios
    .get(`https://makisubs.online/episodes/${anime}x${episode}`, {
      headers: {
        Referer: `https://makisubs.online/episodes/${anime}x${episode}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });

      let episode_url_cleaning = [];
      const thumbnail = dom.window.document.querySelector(".g-item a");
      const items = dom.window.document
        .querySelector("#playeroptionsul")
        .querySelectorAll("li.dooplay_player_option");

      await Promise.all(
        Array.from(items).map(async function (x) {
          const playerName = x.querySelector(".title").textContent;
          const playerInfo = await MakiSubsAPI(
            "doo_player_ajax",
            x.getAttribute("data-post"),
            x.getAttribute("data-nume"),
            x.getAttribute("data-type")
          );

          if (playerInfo === null) {
            return;
          }
          episode_url_cleaning.push({
            player: playerName,
            url: playerInfo.embed_url,
          });
        })
      );

      return {
        status: 200,
        message: "Success",
        episode_thumbnail: thumbnail ? thumbnail.href : null,
        episode_url: episode_url_cleaning,
        episode_next_url: Number(episode) + 1,
      };
    })
    .catch((err) => {
      // console.log(err)
      return {
        status: 500,
        message: "Something went wrong!",
      };
    });

  return request;
}
export default MakiSubs;
