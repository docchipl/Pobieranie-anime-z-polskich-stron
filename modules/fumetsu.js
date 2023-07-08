import axios from "axios";
import jsdom from "jsdom";
import CompilePlayerData from "../utils/CompileEpisodeData.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function FumetsuSubs(anime, episode) {
  const request = axios
    .get(`https://fumetsu.pl/anime/${anime}/${episode}`, {
      headers: {
        Referer: `https://fumetsu.pl/anime/${anime}/${episode}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });

      let episode_url_cleaning = [];
      const items = dom.window.document.querySelectorAll(".video_cont iframe");

      await Promise.all(
        Array.from(items).map(async function (x) {
          const data = CompilePlayerData(x.src);

          if (data.code === 404) {
            return;
          }

          episode_url_cleaning.push({
            player: data.hosting,
            url: data.player_embed,
          });
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
export default FumetsuSubs;

console.log(await FumetsuSubs("NanatsunoMakengaShihaiSuru", 12));
