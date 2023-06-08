import axios from "axios";
import jsdom from "jsdom";
import playerName from "../../functions/playerName.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});


export default function Paldea(episode) {
  const request = axios
    .get(`https://paldea.pl/odcinek/${episode}`, {
      headers: {
        Referer: `https://paldea.pl/odcinek/${episode}`,
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      },
    })
    .then(async function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });
      let episode_url_cleaning = [];
      let episode_next_url = null;

      const items = dom.window.document.querySelectorAll(".video-container");
      const urls = dom.window.document.querySelectorAll(".post-content .fusion-layout-column .fusion-column-wrapper .fusion-align-block a.fusion-button");

      await Promise.all(
        Array.from(urls).map(async function (x) {
          const splitURL = x.href.split("/");
          if(!splitURL.includes("odcinek")){
            return;
          }

          if(splitURL.pop() === episode){
            return
          }

          episode_next_url = splitURL.pop();

        })
      )

      await Promise.all(
        Array.from(items).map(async function (x) {
          const player = x.querySelector("iframe").src;

          episode_url_cleaning.push({
            player: playerName(player),
            url: player,
          });
        })
      );

      return {
        status: 200,
        message: "Success",
        episode_url: episode_url_cleaning,
        episode_next_url: episode_next_url,
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