import axios from 'axios';
import jsdom from 'jsdom';

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
      const items = dom.window.document.querySelector('.v-responsive__content div.v-card__text.fill-height iframe').src;
      let episode_url_cleaning = [];

      const url = new URL(items);
      if(url.host.split('.').length === 3){
        episode_url_cleaning.push({
          player: url.host.replace(/^[^.]+\./g, "").split('.')[0].toUpperCase(),
          url: items
        });
      }else{
        episode_url_cleaning.push({
          player: url.host.split('.')[0].toUpperCase(),
          url: items
        });
      }


      return ({
        status: 200, 
        message: "Success",
        episode_url: episode_url_cleaning,
        episode_next_url: `${Number(episode)+1}`
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