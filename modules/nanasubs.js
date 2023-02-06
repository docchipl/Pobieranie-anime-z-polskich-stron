import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function NanaSubs (anime, episode){
    const request = axios.get(`https://nanasubs.fun/anime/${anime}/odcinek-${episode}`, {
        headers: {
          Referer: `https://nanasubs.fun/anime/${anime}/odcinek-${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        //console.log(response.data)
        const dom = new JSDOM(response.data, { virtualConsole });
        const nanaArray = dom.window.document.querySelectorAll(`script[type="application/ld+json"]`);
        const nanaData = JSON.parse(Array.from(nanaArray)[1].textContent)
        const items = dom.window.document.querySelectorAll('.ns-episode-players-option');

        let episode_url_cleaning = [];

        await Promise.all(
          Array.from(items).map(async function(x) {

            episode_url_cleaning.push({
                player: x.getAttribute("data-player"),
                url: x.getAttribute("data-player-url")
            });
          })
        )
        
        return ({
          status: 200, 
          message: "Success",
          episode_thumbnail: nanaData.thumbnailUrl || null,
          episode_url: episode_url_cleaning,
          episode_next_url: Number(episode)+1
        })
      }).catch(err => {
        //console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
      });

      return (request);
}
export default NanaSubs;