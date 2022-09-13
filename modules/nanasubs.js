import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function NanaSubs (anime, episode){
    const request = axios.get(`https://nanasubs.pl/anime/${anime}/odcinki/${episode}`, {
        headers: {
          Referer: `https://nanasubs.pl/anime/${anime}/odcinki/${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll('#players-btn .episode__players-list span');

        let episode_url_cleaning = [];
        let episode_next_url = dom.window.document.querySelector('.episode__episodes-list .episode__tile a[class="episode__tile-link"]').href.split('/').pop().replace(/[A-Za-z]/g, "");

        for (var i = 0; i < items.length; ++i) {
          episode_url_cleaning.push({
            player: items[i].textContent.toUpperCase(),
            url: items[i].getAttribute('data-player-url')
          });
        }
        
        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning,
          episode_next_url: episode >= episode_next_url ? ( null ):( Number(episode_next_url) )
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