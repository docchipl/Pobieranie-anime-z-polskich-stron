import axios from 'axios';
import jsdom from 'jsdom';
import { playerChecking } from "../functions/index.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function Reiko (anime, episode){
    const request = axios.get(`https://reikoproject.blogspot.com/${anime}.html`, {
        headers: {
          Referer: `https://reikoproject.blogspot.com/${anime}.html`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll(`div[style='font-family: "times new roman";'] i b`);

        let episode_url_cleaning = [];

        await Promise.all(
          Array.from(items).map(function(x) {
            if(x.querySelector("a")){
              const text = x.textContent;
              const link = x.querySelector("a");

              if(link && playerChecking(link.href)){
                if(Number(text.match(/(\d+)/)[0]) === Number(episode)){
                  episode_url_cleaning.push({
                    player: "CDA",
                    url: link.href
                  });
                }
              }
            }
            return;
          })
        )

        if(episode_url_cleaning.length === 0){
          return ({
            status: 500,
            message: "Something went wrong!"
          })
        }else{
          return ({
            status: 200, 
            message: "Success",
            episode_url: episode_url_cleaning,
            episode_next_url: Number(episode)+1
          })
        }
        
      }).catch(err => {
        //console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
      });

      return (request);
}
export default Reiko;