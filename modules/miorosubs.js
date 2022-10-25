import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function MioroSubs (anime, episode){
    const request = axios.get(`https://miorosubs.7m.pl/${anime}-odcinek-${episode}`, {
        headers: {
          Referer: `https://miorosubs.7m.pl/${anime}-odcinek-${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });

        let episode_url_cleaning = [];
        const items = dom.window.document.querySelector('#mirror').querySelectorAll('option');

        Array.from(items).map(function(x) {
          if(x.textContent.split(' ')[0].toLowerCase() === "wybierz") return;

            episode_url_cleaning.push({
              player: x.textContent.split(' ')[0],
              url: x.value
            });
        })

        return ({
          status: 200, 
          message: "Success",
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
export default MioroSubs;