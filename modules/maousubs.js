import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function MaouSubs (anime, episode){
    const request = axios.get(`https://maousubs.pythonanywhere.com/episode/${anime}-${episode}`, {
        headers: {
          Referer: `https://maousubs.pythonanywhere.com/episode/${anime}-${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll('#btn-PLCGMDM');
        let episode_url_cleaning = [];

        for (var i = 0; i < items.length; ++i) {
            episode_url_cleaning.push({
              player: items[i].textContent,
              url: items[i].getAttribute('data-embed')
            });
        }
        
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
export default MaouSubs;