import axios from 'axios';
import jsdom from 'jsdom';
import {unraw} from 'unraw';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function FrixySubs (anime, episode){
    const request = axios.get(`https://frixysubs.pl/anime/${anime}/${episode}`, {
        headers: {
          Referer: `https://frixysubs.pl/anime/${anime}/${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
  
        let episode_url_cleaning;
        const items = dom.window.document.querySelectorAll('script')
        for (var i = 0; i < items.length; ++i) {
            if (items[i].innerHTML.includes('players') && items[i].innerHTML.includes('NUXT')) {
              //Old school XD
              var x = unraw(`{"players"${items[i].textContent.match(/\players(.+)\uploader/)[1].replace(/,$/,"")}}`);
              var o = new Function("return " + x)();
             
              episode_url_cleaning = o;
            }
        }
    
        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning.players.map(function(x) {
            return({
              player: x.name,
              url: x.link
            })
          }),
          episode_next_url: `/anime/${anime}/${Number(episode)+1}`
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
export default FrixySubs;