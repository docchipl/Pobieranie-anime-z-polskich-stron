import axios from 'axios';
import jsdom from 'jsdom';
import { playerChecking } from "../functions/index.js";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function CDA (anime, episode){
    const request = axios.get(`https://kathsubs.blogspot.com/p/${anime}.html`, {
        headers: {
          Referer: `https://kathsubs.blogspot.com/p/${anime}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll('.post-body.entry-content span');

        let episode_url_cleaning = [];

        await Promise.all(
          Array.from(items).map(function(x) {
            const link = x.querySelector("a");
            const text = x.textContent;
            const definePlayer = !link ? null : playerChecking(link.href);

            if(link && definePlayer){
                if(Number(text.match(/(\d+)/)[0]) === Number(episode)){
                    episode_url_cleaning.push({
                        player: definePlayer.name,
                        url: link.href
                    });
                }
            }
            
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
export default CDA;