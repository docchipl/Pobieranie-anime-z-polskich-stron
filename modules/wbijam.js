import axios from 'axios';
import jsdom from 'jsdom';
import {secondRequest} from '../functions/index.js';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function Wbijam (anime, episode){
    const request = axios.get(`https://${anime}.wbijam.pl/${episode}.html`, {
        headers: {
          Referer: `https://${anime}.wbijam.pl/${episode}.html`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });

        const items = dom.window.document.querySelectorAll('tr.lista_hover');

        if(Array.from(items).length === 0 && !dom.window.document.querySelector(".pod_naglowek")) return ({ status: 500, message: "Something went wrong!", message_extra: "Page loads but doesn't have a header or players."});
        if(Array.from(items).length === 0 && dom.window.document.querySelector(".pod_naglowek")) return ({ status: 204, message: "Page loads but doesn't have any players."});

        const episode_next_url = dom.window.document.querySelector('.nawigacja_prawa a').href
        let episode_url_cleaning = [];

        await Promise.all(
          Array.from(items).map(async function(x) {
            const virtualConsoleRequest = new jsdom.VirtualConsole();
            virtualConsoleRequest.on("error", () => {
            // No-op to skip console errors.
            });
            const player_info = {
              anime: anime,
              slug: x.querySelector(".odtwarzacz_link").getAttribute("rel"),
              player_name: x.querySelectorAll("td.center")[2].textContent
            }

            if(player_info.player_name.toLocaleLowerCase() === "vk") return;

            const requestPlayer = await secondRequest(player_info);
            if(!requestPlayer.data) return;

            const player_url = new JSDOM(requestPlayer.data, { virtualConsoleRequest }).window.document.querySelector("center iframe").src;

            episode_url_cleaning.push({
              player: player_info.player_name,
              url: player_url
            });
          })
        )

        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning,
          episode_next_url: !episode_next_url ? ( null ):( episode_next_url.replaceAll(".html", "") )
        })
      }).catch(err => {
        console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
      });

      return (request);
}
export default Wbijam;