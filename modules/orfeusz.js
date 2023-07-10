import axios from "axios";
import jsdom from "jsdom";
import {OrfeuszAPI} from '../api/index.js';
import CompilePlayerData from "../utils/CompileEpisodeData.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

//decode base64 player :)

function OrfeuszSubs(anime, episode) {
  const request = axios
    .get(`https://www.orfeusz-subs.pl/anime/${anime}`, {
      headers: {
        Referer: `https://www.orfeusz-subs.pl/anime/${anime}`,
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });
      const items = dom.window.document.querySelectorAll(
        "#list-tab button.list-group-item.btn-glass"
      );
      let episode_url_cleaning = [];

      await Promise.all(
        Array.from(items).map(async function (x) {
          const episodeNumber = Number(
            x.textContent.toLowerCase().replaceAll("odcinek", "")
          );
          const episodeID = Number(
            x.getAttribute("onclick").replace(/\D/g, "")
          );

          if (episodeNumber === Number(episode)) {
            const player = await OrfeuszAPI(episodeID);

            if (player === null) {
              return {
                status: 500,
                message: "Something went wrong!",
              };
            }

            const playerURL = player.match(
              /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
            )[0];
            const data = CompilePlayerData(playerURL);

            if (data.code === 404) {
              return;
            }

            episode_url_cleaning.push({
              player: data.hosting,
              url: data.player_embed,
            });
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
        episode_next_url: episode + 1,
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
export default OrfeuszSubs;
