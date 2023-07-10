import axios from "axios";
import jsdom from "jsdom";
import CompilePlayerData from "../../utils/CompileEpisodeData.js";
import {JuniorSubsAPI} from "../../api/index.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default function JuniorSubs(category, anime, episode) {
  const request = axios
    .get(`https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`, {
      headers: {
        Referer: `https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(async function (response) {
      const { request } = response;
      const dom = new JSDOM(response.data, { virtualConsole });
      const player = dom.window.document.querySelector(
        '.elementor-widget[data-element_type="widget"] .elementor-widget-container iframe'
      );
      const data = CompilePlayerData(player.src);

      if (
        [404, 501].includes(data.code) ||
        new URL(request.res.responseUrl).pathname !==
          `/${category}/${anime}/odcinek-${episode}/`
      ) {
        return {
          status: 500,
          message: "Something went wrong!",
        };
      }

      const thumbnail = await JuniorSubsAPI({
        category: category,
        anime: anime,
        episode: Number(episode),
      });

      let episode_url_cleaning = [
        {
          player: data.hosting,
          url: data.player_embed,
        },
      ];

      return {
        status: 200,
        message: "Success",
        episode_thumbnail: thumbnail.thumbnail,
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
