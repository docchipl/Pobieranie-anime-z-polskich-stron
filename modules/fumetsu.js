import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function FumetsuSubs (anime, episode){
    const request = axios.get(`https://fumetsu.pl/anime/${anime}/${episode}`, {
        headers: {
          Referer: `https://fumetsu.pl/anime/${anime}/${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });

        let episode_url_cleaning = [];
        const items = dom.window.document.querySelectorAll('.video_cont iframe');
        for (var i = 0; i < items.length; ++i) {
          const string = items[i].src;

          const url = new URL(string);
          if(url.host.split('.').length === 3){
            episode_url_cleaning.push({
              player: url.host.replace(/^[^.]+\./g, "").split('.')[0].toUpperCase(),
              url: string
            });
          }else{
            episode_url_cleaning.push({
              player: url.host.split('.')[0].toUpperCase(),
              url: string
            });
          }

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
export default FumetsuSubs;