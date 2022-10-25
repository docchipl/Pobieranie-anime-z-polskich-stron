import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function DayidSub (anime, episode){
    const request = axios.get(`https://dayidsub.pl/${anime}/episode${episode}`, {
        headers: {
          Referer: `https://dayidsub.pl/${anime}/episode${episode}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });

        let episode_url_cleaning;
        const items = dom.window.document.querySelectorAll('.episode .links');
        const next_url = dom.window.document.querySelector('.pageNav .right a').href.replace(/[A-Za-z]/g, "");
        for (var i = 0; i < items.length; ++i) {
          const string = items[i].textContent;
          const matches = string.match(/\bhttps?:\/\/\S+/gi);
          episode_url_cleaning = matches.map(function(x) {
            const url = new URL(x);
            if(url.host.split('.').length === 3){
              return({
                player: url.host.replace(/^[^.]+\./g, "").split('.')[0].toUpperCase(),
                url: x.replaceAll("'", "")
              })
            }else{
              return({
                player: url.host.split('.')[0].toUpperCase(),
                url: x.replaceAll("'", "")
              })
            }
          })
        }

        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning,
          episode_next_url: next_url === ":#" ? ( null ) : ( Number(next_url) )
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
export default DayidSub;